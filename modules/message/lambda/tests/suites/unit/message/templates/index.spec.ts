import { RegisterMessage } from "~/message/templates/register"

describe("foo", () => {
  it("should whatever", async () => {
    const template = new RegisterMessage({
      domain: "go.ginseng.ai",
      name: "MY COMPANY",
      code: "abcd"
    })
    const y = await template.send() // render!
    console.log(y)
  })
})
