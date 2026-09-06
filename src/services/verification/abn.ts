import type { AUState } from "@/lib/constants";

export type EmployerVerificationStatus =
  | "live_verified"
  | "live_not_found"
  | "manual_required"
  | "invalid_identifier"
  | "service_error";

export interface EmployerVerificationMatch {
  abn?: string;
  name: string;
  status?: string;
  entityType?: string;
  gst?: string;
  state?: string;
  postcode?: string;
  score?: string;
  businessNames?: string[];
}

export interface EmployerVerificationResult {
  status: EmployerVerificationStatus;
  query: string;
  checkedAt: string;
  sourceName: "ABN Lookup";
  sourceUrl: string;
  lookupUrl: string;
  asicUrl: string;
  matches: EmployerVerificationMatch[];
  message: string;
  limitations: string[];
}

const ABN_JSON_BASE_URL = "https://abr.business.gov.au/json";
const ASIC_BUSINESS_NAMES_URL =
  "https://asic.gov.au/online-services/search-asic-registers/business-names/";

export async function verifyEmployerIdentity(
  query: string,
  state?: AUState
): Promise<EmployerVerificationResult> {
  const normalizedQuery = query.trim();
  const checkedAt = new Date().toISOString();
  const lookupUrl = buildAbnSearchUrl(normalizedQuery);
  const baseResult = {
    query: normalizedQuery,
    checkedAt,
    sourceName: "ABN Lookup" as const,
    sourceUrl: "https://abr.business.gov.au/",
    lookupUrl,
    asicUrl: ASIC_BUSINESS_NAMES_URL,
    matches: [],
    limitations: [
      "ABN registration does not prove the job ad or recruiter is genuine.",
      "A business name match still needs workplace address and official contact verification.",
      "ASIC business name holder checks may require manual review through ASIC Connect.",
    ],
  };

  if (normalizedQuery.length < 2) {
    return {
      ...baseResult,
      status: "invalid_identifier",
      message: "Enter an ABN, ACN, or employer/business name to verify.",
    };
  }

  const guid = process.env.ABN_LOOKUP_GUID;
  if (!guid) {
    return {
      ...baseResult,
      status: "manual_required",
      message:
        "ABN_LOOKUP_GUID is not configured, so live ABN Lookup cannot run. Use the official links to verify manually.",
    };
  }

  try {
    const digits = normalizedQuery.replace(/\D/g, "");

    if (digits.length === 11) {
      if (!isValidAbn(digits)) {
        return {
          ...baseResult,
          status: "invalid_identifier",
          message: "The ABN format failed the checksum validation.",
        };
      }

      const payload = await fetchJsonp(`${ABN_JSON_BASE_URL}/AbnDetails.aspx`, {
        abn: digits,
        guid,
      });
      const match = mapAbnDetails(payload);

      return {
        ...baseResult,
        status: match ? "live_verified" : "live_not_found",
        matches: match ? [match] : [],
        message: match
          ? "ABN found. Still verify the workplace address and contact channel independently."
          : "No ABN record was returned for this identifier.",
      };
    }

    if (digits.length === 9) {
      const payload = await fetchJsonp(`${ABN_JSON_BASE_URL}/AcnDetails.aspx`, {
        acn: digits,
        guid,
      });
      const match = mapAbnDetails(payload);

      return {
        ...baseResult,
        status: match ? "live_verified" : "live_not_found",
        matches: match ? [match] : [],
        message: match
          ? "ACN-linked ABN found. Still verify the workplace address and official contact channel."
          : "No ABN record was returned for this ACN.",
      };
    }

    const payload = await fetchJsonp(`${ABN_JSON_BASE_URL}/MatchingNames.aspx`, {
      name: normalizedQuery,
      guid,
    });
    const matches = mapNameMatches(payload, state);

    return {
      ...baseResult,
      status: matches.length > 0 ? "live_verified" : "live_not_found",
      matches,
      message:
        matches.length > 0
          ? "Matching ABN records found. Choose the record that matches the workplace and official employer details."
          : "No matching ABN record was returned for this name.",
    };
  } catch (error) {
    console.error("ABN Lookup verification failed:", error);

    return {
      ...baseResult,
      status: "service_error",
      message:
        "ABN Lookup could not be reached or returned an unexpected response. Verify manually before sharing documents.",
    };
  }
}

function buildAbnSearchUrl(query: string) {
  const searchText = encodeURIComponent(query);
  return `https://abr.business.gov.au/Search/ResultsAll?SearchText=${searchText}`;
}

async function fetchJsonp(
  url: string,
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const searchParams = new URLSearchParams({
    ...params,
    callback: "callback",
  });
  const response = await fetch(`${url}?${searchParams.toString()}`, {
    headers: { Accept: "application/javascript, application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`ABN Lookup returned ${response.status}`);
  }

  const body = await response.text();
  return parseJsonp(body);
}

function parseJsonp(body: string): Record<string, unknown> {
  const start = body.indexOf("(");
  const end = body.lastIndexOf(")");

  if (start === -1 || end === -1 || end <= start) {
    return JSON.parse(body) as Record<string, unknown>;
  }

  return JSON.parse(body.slice(start + 1, end)) as Record<string, unknown>;
}

function mapAbnDetails(
  payload: Record<string, unknown>
): EmployerVerificationMatch | null {
  const abn = toStringValue(payload.Abn);
  const name =
    toStringValue(payload.EntityName) ||
    toStringValue(payload.BusinessName) ||
    toStringValue(payload.MainName);

  if (!abn && !name) return null;

  return {
    abn,
    name: name || abn || "Unknown ABN record",
    status: toStringValue(payload.AbnStatus),
    entityType:
      toStringValue(payload.EntityTypeName) || toStringValue(payload.EntityTypeCode),
    gst: toStringValue(payload.Gst),
    state: toStringValue(payload.AddressState),
    postcode: toStringValue(payload.AddressPostcode),
    businessNames: toStringArray(payload.BusinessName),
  };
}

function mapNameMatches(
  payload: Record<string, unknown>,
  state?: AUState
): EmployerVerificationMatch[] {
  const names = Array.isArray(payload.Names) ? payload.Names : [];

  return names
    .map((item) =>
      typeof item === "object" && item !== null
        ? mapNameMatch(item as Record<string, unknown>)
        : null
    )
    .filter((item): item is EmployerVerificationMatch => Boolean(item))
    .filter((item) => !state || !item.state || item.state === state)
    .slice(0, 5);
}

function mapNameMatch(
  item: Record<string, unknown>
): EmployerVerificationMatch | null {
  const name =
    toStringValue(item.Name) ||
    toStringValue(item.MainName) ||
    toStringValue(item.BusinessName);

  if (!name) return null;

  return {
    abn: toStringValue(item.Abn),
    name,
    status: toStringValue(item.AbnStatus),
    entityType: toStringValue(item.NameType),
    state: toStringValue(item.State),
    postcode: toStringValue(item.Postcode),
    score: toStringValue(item.Score),
  };
}

function toStringValue(value: unknown) {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") return String(value);
  return undefined;
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item))
      .filter((item): item is string => Boolean(item));
  }

  const singleValue = toStringValue(value);
  return singleValue ? [singleValue] : undefined;
}

function isValidAbn(abn: string) {
  if (!/^\d{11}$/.test(abn)) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = abn.split("").map(Number);
  digits[0] -= 1;
  const sum = digits.reduce((total, digit, index) => total + digit * weights[index], 0);

  return sum % 89 === 0;
}
