import { ApiDefaultParams } from "./ApiDefaultParams";

class ApiUtil {
  public static transformDefaultParams = (params: ApiDefaultParams) => ({
    // ...(params.lang ? { "Accept-Language": params.lang } : {}),
    // ...(params.auth ? { Authorization: `Bearer ${params.auth}` } : {}),
    // ...(params.recaptchaToken ? { "x-google-recaptcha": params.recaptchaToken } : {}),
  });
}

export { ApiUtil };
