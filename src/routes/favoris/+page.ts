import { get } from "svelte/store";
import type { PageLoad } from "./$types";
import { userInfo } from "$lib/utils/auth";
import { getService, getServiceDI } from "$lib/requests/services";
import dayjs from "dayjs";
import type { Bookmark, Service } from "$lib/types";

async function computeServiceInfos(
  bookmarks: Bookmark[],
  isDI: boolean
): Promise<Bookmark[]> {
  const resultBookmarks: Bookmark[] = [];

  const servicesPromises: Promise<Service>[] = [];
  for (const bookmark of bookmarks) {
    servicesPromises.push(
      isDI ? getServiceDI(bookmark.diId) : getService(bookmark.serviceSlug)
    );
  }
  const services = await Promise.all(servicesPromises);
  services.forEach((service) => {
    if (!service) {
      return;
    }

    const doraBookmark = bookmarks.find(
      (bookmark) =>
        bookmark.diId === service.slug || bookmark.serviceSlug === service.slug
    );
    resultBookmarks.push({
      ...doraBookmark,
      service,
      creationDate: doraBookmark!.creationDate,
      isDI,
    });
  });

  return resultBookmarks;
}

export const load: PageLoad = async ({ parent }) => {
  await parent();

  const user = get(userInfo);
  if (!user) {
    return {};
  }

  const bookmarks: Bookmark[] = [];

  // Récupération des favoris Dora
  const userDoraBookmarks = user.bookmarks.filter((bmk) => bmk.serviceSlug);
  bookmarks.push(...(await computeServiceInfos(userDoraBookmarks, false)));

  const userDiBookmarks = user.bookmarks.filter((bmk) => bmk.diId);
  bookmarks.push(...(await computeServiceInfos(userDiBookmarks, true)));

  return {
    title: "Mes favoris | DORA",
    noIndex: true,
    bookmarks: bookmarks.sort((a, b) =>
      dayjs(a.creationDate).isBefore(dayjs(b.creationDate)) ? 1 : -1
    ),
  };
};
