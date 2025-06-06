/* tslint:disable:no-console */
import { expect, test } from "bun:test";
import * as fs from "fs";
import { TanRequiredError } from "../errors/tan-required-error";
import { PinTanClient } from "../pin-tan-client";
import { SEPAAccount } from "../types";

const name = process.env.FINTS_USER;
const pin = process.env.FINTS_PASSWORD;
const blz = process.env.FINTS_BLZ;
const url = process.env.FINTS_URL;

// Skip E2E tests if environment variables are not set
const skipIfMissingEnv = !name || !pin || !blz || !url;

const productId = "9FA6681DEC0CF3046BFC2F8A6";

/**
 * User acceptance test to see if actual implementation works with bank in question
 *
 * @group acceptance
 */

test("get accounts", async () => {
    if (skipIfMissingEnv) {
        console.log("Skipping E2E test - missing environment variables (FINTS_USER, FINTS_PASSWORD, FINTS_BLZ)");
        return;
    }

    const client = new PinTanClient({ blz: blz!, name: name!, pin: pin!, url: url!, productId, debug: true });
    try {
        const accounts = await client.accounts();
        expect(accounts.length).toBeGreaterThan(0);
        fs.writeFileSync("/tmp/account.json", JSON.stringify(accounts[0]));
    } catch (error) {
        if (error instanceof TanRequiredError) {
            fs.writeFileSync("/tmp/hitan-auftragsreferenz.txt", error.transactionReference);
            fs.writeFileSync("/tmp/challenge.png", error.challengeMedia);
        } else {
            console.error(error);
        }
    }
}, 600000);

test("get statements", async () => {
    if (skipIfMissingEnv) {
        console.log("Skipping E2E test - missing environment variables");
        return;
    }

    const client = new PinTanClient({ blz: blz!, name: name!, pin: pin!, url: url!, productId, debug: true });
    const account: SEPAAccount = JSON.parse((fs.readFileSync("/tmp/account.json") as Buffer).toString());
    const startDate = new Date("2019-09-27T12:00:00Z");
    const endDate = new Date("2019-12-27T12:00:00Z");

    try {
        const statements = await client.statements(account, startDate, endDate);
        expect(statements.length).toBeGreaterThan(0);
        fs.unlinkSync("/tmp/statements-status.txt");
    } catch (error) {
        if (error instanceof TanRequiredError) {
            console.log("Transaction Reference: " + error.transactionReference);
            fs.writeFileSync("/tmp/statements-status.txt", JSON.stringify(error));
        } else {
            console.error(error);
        }
    }
}, 600000);

test("complete statements", async () => {
    if (skipIfMissingEnv) {
        console.log("Skipping E2E test - missing environment variables");
        return;
    }

    const client = new PinTanClient({ blz: blz!, name: name!, pin: pin!, url: url!, productId, debug: true });
    const tan = "492857";

    try {
        const tanRequiredError = JSON.parse(
            (fs.readFileSync("/tmp/statements-status.txt") as Buffer).toString()
        ) as TanRequiredError;

        const statements = await client.completeStatements(
            tanRequiredError.dialog,
            tanRequiredError.transactionReference,
            tan
        );
        expect(statements.length).toBeGreaterThan(0);
        fs.unlinkSync("/tmp/statements-status.txt");
    } catch (error) {
        if (error instanceof TanRequiredError) {
            fs.writeFileSync("/tmp/statements-status.txt", JSON.stringify(error));
        } else {
            console.error(error);
        }
    }
}, 600000);
