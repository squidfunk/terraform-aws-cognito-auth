import axios from "axios";
import * as FormData  from 'form-data';

import { TLeadRaw, TLeadResponse } from "./types";

class ZohoService {
  static client_id = process.env.ZOHO_ID;
  static client_secret = process.env.ZOHO_SECRET;
  static access_token = process.env.ZOHO_TOKEN;
  static refresh_token = process.env.ZOHO_REFRESH_TOKEN;
  static lead_url = "https://www.zohoapis.com/crm/v2/Leads/";

  static async findLead(data: TLeadResponse): Promise<any> {
    const options = {
      method: "GET",
      url: ZohoService.lead_url + "search",
      headers: {
        Authorization: "Bearer " + ZohoService.access_token,
      },
      params: {
        criteria: data.id
          ? `id:equals:${data.id}`
          : `Email:equals:${data.Email}`,
      },
    };

    try {
      const {
        data: [lead],
      }: any = await ZohoService.callApi(options);
      return lead;
    } catch (error) {
      throw new Error("Failed search");
    }
  }

  static async attachments(data: TLeadRaw): Promise<any> {
    const options = {
      method: "GET",
      url: ZohoService.lead_url + data.id + "/Attachments",
      headers: {
        Authorization: "Bearer " + ZohoService.access_token,
      },
    };

    try {
      const { data }: any = await ZohoService.callApi(options);
      return data.map((attachment: any) => {
        return {
          id: attachment.id,
          fileName: attachment.File_Name,
          url: attachment["$link_url"],
        };
      });
    } catch (error) {
      throw new Error("Failed search");
    }
  }

  static async updateLead(id: string, data: any) {
    const options = {
      method: "PUT",
      url: ZohoService.lead_url + id,
      headers: {
        Authorization: "Bearer " + ZohoService.access_token,
      },
      data,
    };

    const {
      data: [
        {
          details: { id: newId },
        },
      ],
    }: any = await ZohoService.callApi(options);
    return newId;
  }

  static async newLead(data: any) {
    const options = {
      method: "POST",
      url: ZohoService.lead_url.slice(0, -1),
      headers: {
        Authorization: "Bearer " + ZohoService.access_token,
      },
      data,
    };

    const {
      data: [
        {
          details: { id: newId },
        },
      ],
    }: any = await ZohoService.callApi(options);
    if (!newId) {
      throw new Error("Failed creating new Zoho lead");
    }
    return newId;
  }

  static async attach(data: TLeadRaw, url: string): Promise<any> {
    const formData = new FormData();
    formData.append("attachmentUrl", url + "&created=" + +new Date());
    const formHeaders = formData.getHeaders();
    var options = {
      method: "POST",
      url: ZohoService.lead_url + data.id + "/Attachments",
      headers: {
        ...formHeaders,
        Authorization: "Bearer " + ZohoService.access_token,
      },
      data: formData,
    };

    const {
      data: [
        {
          details: { id: newId },
        },
      ],
    }: any = await ZohoService.callApi(options);
    return newId;
  }

  static async refreshToken(): Promise<string> {
    const options = {
      method: "POST",
      url: "https://accounts.zoho.com/oauth/v2/token",
      params: {
        grant_type: "refresh_token",
        refresh_token: ZohoService.refresh_token,
        client_id: ZohoService.client_id,
        client_secret: ZohoService.client_secret,
      },
    };

    const {
      data: { access_token },
    } = await ZohoService.executeCall(options);
    return access_token;
  }

  static async callApi(options: any, refresh?: boolean): Promise<any> {
    const response = await ZohoService.executeCall(options);

    const data =
      response.data.data[0] ||
      response.response.data.data[0] ||
      response.response.data[0] ||
      response.response.data ||
      response.data;
    if (data && (!data.status || data.status != "error")) {
      return response.data;
    }
    if (refresh) {
      switch (data.code) {
        case "INVALID_TOKEN":
          throw new Error(data.message || "Invalid authorization token");
        default:
          throw new Error(data.message || "Unknown failure");
      }
    } else {
      switch (data.code) {
        case "INVALID_TOKEN":
          ZohoService.access_token = await ZohoService.refreshToken();
          options.headers.Authorization = "Bearer " + ZohoService.access_token;
          return await ZohoService.callApi(options, true);
        default:
          throw new Error(data.message || "Unknown failure");
      }
    }
  }

  static async executeCall(options: any) {
    try {
      return axios(options).catch((error) => {
        return error;
      });
    } catch (error) {
      throw error;
    }
  }
}

export default ZohoService;
