import { getUserInfo, type UserInfo } from "$lib/auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  const serverToken = cookies.get("server-token");
  let userInfo: UserInfo;
  console.log("reading token", serverToken);
  if (serverToken) {
    userInfo = await (await getUserInfo(serverToken, fetch)).json();
  }
  console.log("layout server", userInfo?.firstName);
  return {
    serverToken,
    userInfo,
  };
};
