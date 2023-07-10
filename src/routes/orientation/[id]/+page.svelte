<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
  import Breadcrumb from "$lib/components/display/breadcrumb.svelte";

  import CenteredGrid from "$lib/components/display/centered-grid.svelte";
  import DateLabelNumeric from "$lib/components/display/date-label-numeric.svelte";
  import {
    attachmentIcon,
    calendarEventLineIcon,
    compass3Icon,
    homeSmile2Icon,
    inboxLineIcon,
    listCheckIcon,
    mailAddLineIcon,
    messageLineIcon,
    phoneLineIcon,
    serviceIcon,
    user6Icon,
    userSharedLineIcon,
  } from "$lib/icons";
  import HandleOrientation from "./handle-orientation.svelte";
  import SubTitle from "./sub-title.svelte";
  import ContactListItem from "./contact-list-item.svelte";
  import { formatPhoneNumber } from "$lib/utils/misc";
  import { getOrientation } from "$lib/utils/orientation";
  import type { PageData } from "./$types";
  import { formatNumericDate } from "$lib/utils/date";

  export let data: PageData;
  let { sendOrientation } = data;

  onMount(() => {
    // trackOrientationConsultation(data.id, $page.url);
  });

  afterUpdate(() => {
    console.log("update page");
  });

  async function onRefresh() {
    sendOrientation = await getOrientation(sendOrientation.queryId);
  }
</script>

<CenteredGrid noPadding>
  <div class="mt-s24 print:mb-s0">
    <Breadcrumb currentLocation="service-orientation-answer" dark />
  </div>
</CenteredGrid>

<CenteredGrid>
  <div>
    <h1>Demande d’orientation #{sendOrientation.id}</h1>
    <p class="text-f16">
      <span class="font-bold">Date d‘envoi de la demande :</span>
      <DateLabelNumeric date={sendOrientation.creationDate} />
    </p>

    <div
      class="mt-s40 flex flex-col-reverse justify-between gap-x-s24 md:flex-row"
    >
      <div class="flex flex-1 flex-col gap-s32">
        <div
          class="flex w-full items-center rounded-md border border-blue-information bg-blue-light p-s24"
        >
          <div
            class="mr-s16 inline-block rounded-xl bg-blue-information-dark p-s12"
          >
            <div class="h-s24 w-s24 fill-current text-white">
              {@html compass3Icon}
            </div>
          </div>

          <div>
            <p class="m-s0 text-f14 text-gray-text">
              Service concernée :<br />
              <span class="text-f23 font-bold text-france-blue"
                >{sendOrientation.service?.name}</span
              >
            </p>
          </div>
        </div>

        <div class="flex-[2] rounded-md border border-gray-02 md:relative">
          <div
            class="flex flex-wrap items-center justify-between gap-s12 border-b border-gray-02 px-s16 py-s20 md:px-s35"
          >
            <h2 class="m-s0 text-f23 text-france-blue">La demande</h2>
          </div>

          <div class="flex flex-col gap-s32 p-s35">
            <div>
              <SubTitle label="Bénéficiaire" icon={compass3Icon} />
              <div class="ml-s64">
                <ul class="flex flex-col gap-s12">
                  <ContactListItem
                    icon={user6Icon}
                    text={`${sendOrientation.beneficiaryFirstName} ${sendOrientation.beneficiaryLastName}`}
                  />

                  {#if sendOrientation.beneficiaryEmail}
                    <ContactListItem
                      icon={mailAddLineIcon}
                      text={sendOrientation.beneficiaryEmail}
                      isPreference={sendOrientation.beneficiaryContactPreferences?.includes(
                        "email"
                      )}
                    />
                  {/if}

                  {#if sendOrientation.beneficiaryPhone}
                    <ContactListItem
                      icon={phoneLineIcon}
                      text={formatPhoneNumber(sendOrientation.beneficiaryPhone)}
                      isPreference={sendOrientation.beneficiaryContactPreferences?.includes(
                        "telephone"
                      )}
                    />
                  {/if}

                  {#if sendOrientation.beneficiaryOtherContactMethod}
                    <ContactListItem
                      icon={inboxLineIcon}
                      text={`Autre méthode de contact : ${sendOrientation.beneficiaryOtherContactMethod}`}
                      isPreference={sendOrientation.beneficiaryContactPreferences?.includes(
                        "other"
                      )}
                    />
                  {/if}

                  <ContactListItem
                    icon={calendarEventLineIcon}
                    text={`Disponible à partir de ${formatNumericDate(
                      sendOrientation.beneficiaryAvailability
                    )}`}
                  />
                </ul>
              </div>
            </div>
            <hr class="border border-gray-02" />

            {#if sendOrientation.situation.length}
              <div>
                <SubTitle label="Situation" icon={listCheckIcon} />
                <div class="ml-s64">
                  <ul>
                    {#each sendOrientation.situation as beneficiarySituation}
                      <li class="ml-s16 list-disc text-f16 text-gray-text">
                        {beneficiarySituation}
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
              <hr class="border border-gray-02" />
            {/if}

            {#if sendOrientation.requirements.length}
              <div>
                <SubTitle
                  label="Critères auxquels le ou la bénéficiaire répond"
                  icon={listCheckIcon}
                />
                <div class="ml-s64">
                  <ul>
                    {#each sendOrientation.requirements as requirement}
                      <li class="ml-s16 list-disc text-f16 text-gray-text">
                        {requirement}
                      </li>
                    {/each}
                  </ul>
                </div>
              </div>
              <hr class="border border-gray-02" />
            {/if}

            {#if sendOrientation.orientationReasons}
              <div>
                <SubTitle
                  label="Motifs de l’orientation"
                  icon={messageLineIcon}
                />
                <div class="ml-s64 text-f16 italic text-gray-text">
                  {sendOrientation.orientationReasons}
                </div>
              </div>
            {/if}

            {#if sendOrientation.beneficiaryAttachments?.length}
              <div>
                <SubTitle label="Pièces jointes" icon={attachmentIcon} />
                <div class="ml-s64 text-gray-text">
                  <ul class="mb-s24">
                    {#each sendOrientation.beneficiaryAttachments as file}
                      <li class="ml-s16 list-disc text-f16 text-gray-text">
                        {file}
                      </li>
                    {/each}
                  </ul>

                  <div>
                    Toutes les pièces jointes vous ont été transmises par e-mail
                    le <strong>
                      <DateLabelNumeric date={sendOrientation.creationDate} />
                    </strong>. Sujet de l‘e-mail : «&nbsp;
                    <strong>Nouvelle demande d'orientation reçue</strong>
                    ».
                  </div>

                  <hr class="mt-s24 w-s32" />
                  <p class="mt-s12 text-f12 italic text-gray-text">
                    Pour des raisons de confidentialité et de sécurité, DORA ne
                    peut pas stocker de données sensibles sur sa plateforme. Si
                    vous ne parvenez pas à retrouver l‘e-mail contenant les
                    pièces jointes, veuillez vérifier le dossier
                    Indésirables/Spam de votre boîte e-mail et contacter la
                    personne qui a réalisé la prescription.
                  </p>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="flex-[2] rounded-md border border-gray-02 md:relative">
          <div
            class="flex flex-wrap items-center justify-between gap-s12 border-b border-gray-02 px-s16 py-s20 md:px-s35"
          >
            <h2 class="m-s0 text-f23 text-france-blue">Les contacts</h2>
          </div>

          <div class="flex flex-col gap-s32 p-s35">
            <div>
              <SubTitle
                label="Prescripteur ou prescriptice"
                icon={userSharedLineIcon}
              />
              <div class="ml-s64 text-f16 text-gray-text">
                <ul class="flex flex-col gap-s12">
                  {#if sendOrientation.service?.contactName}
                    <ContactListItem
                      icon={user6Icon}
                      text={sendOrientation.service?.contactName}
                    />
                  {/if}

                  {#if sendOrientation.service?.contactEmail}
                    <ContactListItem
                      icon={mailAddLineIcon}
                      text={sendOrientation.service?.contactEmail}
                    />
                  {/if}

                  {#if sendOrientation.service?.contactPhone}
                    <ContactListItem
                      icon={phoneLineIcon}
                      text={formatPhoneNumber(
                        sendOrientation.service?.contactPhone
                      )}
                    />
                  {/if}

                  {#if sendOrientation.service?.contactOtherMethod}
                    <ContactListItem
                      icon={inboxLineIcon}
                      text={`Autre méthode de contact : ${sendOrientation.service?.contactOtherMethod}`}
                    />
                  {/if}

                  <ContactListItem
                    icon={homeSmile2Icon}
                    text={sendOrientation.service?.name}
                    link={`/services/${sendOrientation.service?.slug}`}
                  />
                </ul>
              </div>
            </div>

            <hr class="border border-gray-02" />
            <div>
              <SubTitle
                label="Conseiller ou conseillère référente"
                icon={serviceIcon}
              />
              <div class="ml-s64 text-f16 text-gray-text">
                <ul class="flex flex-col gap-s12">
                  <ContactListItem
                    icon={user6Icon}
                    text={`${sendOrientation.referentFirstName} ${sendOrientation.referentLastName}`}
                  />
                  {#if sendOrientation.referentEmail}
                    <ContactListItem
                      icon={mailAddLineIcon}
                      text={sendOrientation.referentEmail}
                    />
                  {/if}

                  {#if sendOrientation.referentPhone}
                    <ContactListItem
                      icon={phoneLineIcon}
                      text={formatPhoneNumber(sendOrientation.referentPhone)}
                    />
                  {/if}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-s32 w-full shrink-0 md:w-[384px]">
        <HandleOrientation {sendOrientation} {onRefresh} />
      </div>
    </div>
  </div></CenteredGrid
>
