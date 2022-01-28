import type { Software, Referent, EasilyConsumableEntry } from "./types";

export function generateEasilyConsumableEntries(params: {
    softwares: Software[];
    referents: Referent[];
}): EasilyConsumableEntry[] {
    const { softwares, referents } = params;

    return softwares
        .map(softwares => {
            const { referentId } = softwares;

            if (referentId === undefined) {
                return [softwares, undefined] as const;
            }

            return [softwares, referents.find(({ id }) => id === referentId)] as const;
        })
        .map(
            ([software, referent]): EasilyConsumableEntry => ({
                "id": software._id,
                "name": software._name,
                "function": software._function,
                "referencedSinceYear": new Date(software.__referencedSinceTime).getFullYear().toString(),
                "recommendationStatus": software.recommendationStatus,
                "parentSoftware": software.parentSoftware ?? null,
                "isFromFrenchPublicService": software.isFromFrenchPublicService,
                "isPresentInSupportContract": software.isPresentInSupportContract,
                "alikeSoftwares": software.alikeSoftwares,
                "wikidataId": software.wikidataId ?? null,
                "comptoirDuLibreOrgId": software.comptoirDuLibreOrgId ?? null,
                "license": software._license,
                "whereAndInWhatContextIsItUsed": software.whereAndInWhatContextIsItUsed ?? null,
                "catalogNumeriqueGouvFrId": software.catalogNumeriqueGouvFrId ?? null,
                "mimGroup": software.mimGroup,
                "versionMin": software.__versionMin,
                "versionMax": software.versionMax ?? null,
                "referent":
                    referent === undefined
                        ? null
                        : {
                              "email": referent.email,
                              "emailAlt": referent.emailAlt ?? null,
                              "isReferentExpert": software.isReferentExpert ?? null,
                          },
            }),
        );
}
