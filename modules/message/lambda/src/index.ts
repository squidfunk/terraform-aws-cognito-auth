import { message as builder } from "emailjs"

const message = builder.create({
  from: "you <scifish@gmail.com>",
  to: "someone <scifish@gmail.com>",
  subject: "testing emailjs",
  text: "i hope this works",
  attachment:
    [
      {
        data: "<p>HTML message</p>",
        alternative: true
      },
      {
        path: "dist/templates/images/register.png",
        type: "image/png",
        headers: {
          "Content-ID": "<my-image>"
        }
      }
    ]
})

message.stream().on("data", data => {
  console.log(data) // tslint:disable-line
})
