import { get } from "svelte/store";
import type { PageLoad } from "./$types";
import { userInfo } from "$lib/utils/auth";
import { getServiceDI } from "$lib/requests/services";
import dayjs from "dayjs";
import type { Service } from "$lib/types";

export const load: PageLoad = async ({ parent }) => {
  await parent();

  const user = get(userInfo);
  if (!user) {
    return {};
  }

  const bookmarks = user.bookmarks;

  // Ajout des favoris de DI
  const servicesPromises: Promise<Service>[] = [];
  for (const diBookmark of user.diBookmarks) {
    servicesPromises.push(
      getServiceDI(diBookmark.diId + (Math.random() > 0.7 ? "8" : ""))
    );
  }
  const services = await Promise.all(servicesPromises);
  services.forEach((service) => {
    if (service == null) {
      return;
    }
    const diBookmark = user.diBookmarks.find(
      (bookmark) => bookmark.diId === service.slug
    );
    bookmarks.push({
      service,
      creationDate: diBookmark!.creationDate,
      isDI: true,
    });
  });

  return {
    title: "Mes favoris | DORA",
    noIndex: true,
    bookmarks: bookmarks.sort((a, b) =>
      dayjs(a.creationDate).isBefore(dayjs(b.creationDate)) ? 1 : -1
    ),
  };
};
