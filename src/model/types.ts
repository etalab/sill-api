// https://git.sr.ht/~etalab/sill
/*
 * All fields with _ will eventually be fetched from wikiData and thus, removed from Software.
 * We will create a bot that automatically puts data into WikiData. See: http://baskauf.blogspot.com/2019/06/putting-data-into-wikidata-using.html
 * An API will gather all the missing infos so that sill.etalab.gouv.fr and code.gouv.fr work with it.
 * All the fields with __ will be deduced from other metadata.
 */
export type SoftwareCsvRow = {
    //The id should be the one of Wikidata
    _id: number;
    _name: string;
    _function: string;
    //This info could be fetched from git blame.
    __referencedSinceTime: number;
    recommendationStatus: RecommendationStatus;
    parentSoftware?: SoftwareRef;
    isFromFrenchPublicService: boolean;
    isPresentInSupportContract: boolean;
    alikeSoftwares: SoftwareRef[];
    //Should not be optional
    wikidataId?: string;
    //Example https://comptoir-du-libre.org/en/softwares/461 -> 461
    /* cspell: disable-next-line */
    comptoirDuLibreId?: number;
    // https://spdx.org/licenses/
    // https://www.data.gouv.fr/fr/pages/legal/licences/
    _license: string;
    whereAndInWhatContextIsItUsed?: string;
    //Lien vers catalogue.numerique.gouv.fr
    /* cspell: disable-next-line */
    catalogNumeriqueGouvFrId?: string;
    mimGroup: MimGroup;
    __versionMin: string;
    versionMax?: string;
    referentId: number | undefined;
    isReferentExpert?: true;
    workshopUrl?: string;
    testUrl?: string;
    useCasesUrl: string[];
};

export namespace SoftwareCsvRow {
    export const columns = [
        "ID",
        "nom",
        "fonction",
        "annees",
        "statut",
        "parent",
        "public",
        "support",
        "similaire-a",
        "wikidata",
        "comptoir-du-libre",
        "licence",
        "contexte-usage",
        "label",
        "fiche",
        "atelier",
        "test",
        "groupe",
        "version_min",
        "version_max",
    ] as const;

    export type Column = typeof columns[number];
}

export type ReferentCsvRow = {
    id: number;
    email: string;
    emailAlt?: string;
};

export namespace ReferentCsvRow {
    export const columns = [
        "Logiciel",
        "Courriel",
        "Courriel 2",
        "Référent : expert technique ?",
    ] as const;

    export type Column = typeof columns[number];

    export type Stats = Omit<ReferentCsvRow, "id"> & {
        softwaresCount: number;
        //Always at least one element if array defined
        unknownSoftwares?: string[];
    };
}

export type ServiceCsvRow =
    | ServiceCsvRow.KnownSoftware
    | ServiceCsvRow.UnknownSoftware;

export namespace ServiceCsvRow {
    export type Common = {
        id: number;
        agencyName: string;
        publicSector: string;
        agencyUrl: string;
        serviceName: string;
        serviceUrl: string;
        description: string;
        //"2018" | "2019" | "2020" | "2021" | "2022";
        publicationDate: string;
        lastUpdateDate: string;
        signupScope: string;
        usageScope: string;
        signupValidationMethod: string;
        contentModerationMethod: string;
    };

    export type KnownSoftware = Common & {
        softwareId: number;
    };

    export type UnknownSoftware = Common & {
        softwareId?: undefined;
        softwareName: string;
        comptoirDuLibreId?: number;
    };

    export const columns = [
        "id",
        "agency_name",
        "public_sector",
        "agency_url",
        "service_name",
        "service_url",
        "description",
        "software_name",
        "software_sill_id",
        "software_comptoir_id",
        "publication_date",
        "last_update_date",
        "signup_scope",
        "usage_scope",
        "signup_validation_method",
        "content_moderation_method",
    ] as const;

    export type Column = typeof columns[number];
}

export type SoftwareX = {
    id: number;
    name: string;
    function: string;
    //"2018" | "2019" | "2020" | "2021" | "2022";
    referencedSinceYear: string;
    recommendationStatus: RecommendationStatus;
    parentSoftware: SoftwareRef | null;
    isFromFrenchPublicService: boolean;
    isPresentInSupportContract: boolean;
    alikeSoftwares: SoftwareRef[];
    wikidata: WikidataData | null;
    comptoirDuLibreSoftware: ComptoirDuLibre.Software | null;
    license: string;
    whereAndInWhatContextIsItUsed: string | null;
    catalogNumeriqueGouvFrId: string | null;
    mimGroup: MimGroup;
    versionMin: string;
    versionMax: string | null;
    workshopUrl: string | null;
    testUrl: string | null;
    useCasesUrl: string[];
    hasReferent: boolean;
    services: Omit<ServiceCsvRow.KnownSoftware[], "softwareId">;
};

export type SoftwareRef = SoftwareRef.Known | SoftwareRef.Unknown;
export namespace SoftwareRef {
    export type Known = {
        isKnown: true;
        softwareId: number;
    };

    export type Unknown = {
        isKnown: false;
        softwareName: string;
    };
}

export const recommendationStatuses = [
    "recommended",
    "in observation",
    "no longer recommended",
] as const;

export type RecommendationStatus = typeof recommendationStatuses[number];

export const mimGroups = ["MIMO", "MIMDEV", "MIMPROD", "MIMDEVOPS"] as const;

export type MimGroup = typeof mimGroups[number];

export type ComptoirDuLibre = {
    date_of_export: Date;
    number_of_software: number;
    softwares: ComptoirDuLibre.Software[];
};
export declare namespace ComptoirDuLibre {
    export interface Provider {
        id: number;
        url: string;
        name: string;
        type: string;
        external_resources: {
            website: string;
        };
    }

    export interface User {
        id: number;
        url: string;
        name: string;
        type: string;
        external_resources: {
            website: string;
        };
    }

    export interface Software {
        id: number;
        created: Date;
        modified: Date;
        url: string;
        name: string;
        licence: string;
        external_resources: {
            website: string;
            repository: string;
        };
        providers: Provider[];
        users: User[];
    }
}

export type WikidataData = Partial<{
    descriptionFr: string;
    descriptionEn: string;
    logoUrl: string;
    framaLibreId: string;
    websiteUrl: string;
    sourceUrl: string;
    documentationUrl: string;
}>;