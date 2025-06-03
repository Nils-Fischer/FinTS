import { afterEach, beforeEach, expect, mock, test } from "bun:test";
import { readFileSync } from "fs";
import { formatDate } from "../date-utils";
import { Format } from "../format";
import { PinTanClient } from "../pin-tan-client";
import { decodeBase64, encodeBase64 } from "../utils";

const url = "https://example.com/fints";
const name = "test1";
const pin = "12345";
const blz = "12345678";
const productId = "fints";

let client: PinTanClient;
let _originalFormatDate: typeof Format.date;
let _originalFormatTime: typeof Format.time;
let _originalMathRandom: typeof Math.random;
let _originalFetch: typeof globalThis.fetch;

// Track fetch calls for assertions
let fetchCalls: Array<{ url: string; options: any }> = [];

beforeEach(() => {
    // Store original functions
    _originalFormatDate = Format.date;
    _originalFormatTime = Format.time;
    _originalMathRandom = Math.random;
    _originalFetch = globalThis.fetch;

    // Reset fetch calls tracking
    fetchCalls = [];

    // Replace with test implementations
    Format.date = (date) => (date ? formatDate(date, "yyyyMMdd") : "20180101");
    Format.time = (time) => (time ? formatDate(time, "HHMMss") : "120000");
    Math.random = () => 0.5;

    client = new PinTanClient({ blz, name, pin, url, productId });
});

afterEach(() => {
    // Restore original functions
    Format.date = _originalFormatDate;
    Format.time = _originalFormatTime;
    Math.random = _originalMathRandom;
    globalThis.fetch = _originalFetch;
});

test("accounts", async () => {
    const responseFixtures: string[] = JSON.parse(readFileSync(`${__dirname}/fixture-accounts.json`, "utf8"));
    let responseNo = 0;

    // Mock fetch with Bun's native mocking
    globalThis.fetch = mock((url: string, options: any) => {
        fetchCalls.push({ url, options });
        const response = encodeBase64(responseFixtures[responseNo]);
        responseNo++;
        return Promise.resolve(new Response(response, { status: 200 }));
    }) as any;

    const result = await client.accounts();
    expect(result).toMatchSnapshot();

    // Verify fetch calls
    const calls = fetchCalls.map((call) => decodeBase64(String(call.options.body)));
    expect(calls).toMatchSnapshot();
});

test("statements", async () => {
    const responseFixtures: string[] = JSON.parse(readFileSync(`${__dirname}/fixture-statements.json`, "utf8"));
    let responseNo = 0;

    globalThis.fetch = mock((url: string, options: any) => {
        fetchCalls.push({ url, options });
        const response = encodeBase64(responseFixtures[responseNo]);
        responseNo++;
        return Promise.resolve(new Response(response, { status: 200 }));
    }) as any;

    const account = {
        accountNumber: "2",
        bic: "GENODE00TES",
        blz: "12345678",
        iban: "DE111234567800000002",
        subAccount: "",
    };
    const result = await client.statements(account, new Date("2018-01-01T12:00:00Z"), new Date("2018-10-01T12:00:00Z"));
    expect(result).toMatchSnapshot();

    const calls = fetchCalls.map((call) => decodeBase64(String(call.options.body)));
    expect(calls).toMatchSnapshot();
});

test("balance", async () => {
    const responseFixtures: string[] = JSON.parse(readFileSync(`${__dirname}/fixture-balance.json`, "utf8"));
    let responseNo = 0;

    globalThis.fetch = mock((url: string, options: any) => {
        fetchCalls.push({ url, options });
        const response = encodeBase64(responseFixtures[responseNo]);
        responseNo++;
        return Promise.resolve(new Response(response, { status: 200 }));
    }) as any;

    const account = {
        accountNumber: "2",
        bic: "GENODE00TES",
        blz: "12346789",
        iban: "DE111234567800000002",
        subAccount: "",
    };
    const result = await client.balance(account);
    expect(result).toMatchSnapshot();

    const calls = fetchCalls.map((call) => decodeBase64(String(call.options.body)));
    expect(calls).toMatchSnapshot();
});

test("standingOrders", async () => {
    const responseFixtures: string[] = JSON.parse(readFileSync(`${__dirname}/fixture-standingOrders.json`, "utf8"));
    let responseNo = 0;

    globalThis.fetch = mock((url: string, options: any) => {
        fetchCalls.push({ url, options });
        const response = encodeBase64(responseFixtures[responseNo]);
        responseNo++;
        return Promise.resolve(new Response(response, { status: 200 }));
    }) as any;

    const account = {
        accountNumber: "2",
        bic: "DEUTDEFF500",
        blz: "12346789",
        iban: "DE27100777770209299700",
        subAccount: "",
    };
    const result = await client.standingOrders(account);
    expect(result).toMatchSnapshot();

    const calls = fetchCalls.map((call) => decodeBase64(String(call.options.body)));
    expect(calls).toMatchSnapshot();
});
