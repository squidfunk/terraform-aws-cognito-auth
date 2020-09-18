export interface TLeadResponse {
  id?: string;
  First_Name: string;
  Last_Name: string;
  Email: string;
  Phone: string;
  Credit_Report: string;
  Credit_Report_Fee: string;
}

export interface TCreditResponse {
  id: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Phone: string;
}

export interface TLeadRaw {
  id?: string;
  packageId?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  creditReport?: string;
  creditReportFee?: string;
}

export type TLeadInput = TLeadRaw & TLeadResponse & TCreditResponse;
