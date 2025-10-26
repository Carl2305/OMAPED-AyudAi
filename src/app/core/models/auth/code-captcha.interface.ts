export interface CodeCaptchaResponse {
  imageBase64: string;
  token: string;
}

export interface CodeCaptchaRequest {
  token: string;
  userInput: string;
}
