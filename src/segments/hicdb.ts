import {
    CreditTransferTransactionInformationSCT,
    CustomerCreditTransferInitiationV03,
    document,
    PaymentInstructionInformationSCT,
} from "../pain-formats";
import { Parse } from "../parse";
import { StandingOrder } from "../types";
import { SegmentClass } from "./segment";

export class HICDBProps {
    public segNo: number;
    public standingOrder: StandingOrder;
}

/**
 * HICDB (SEPA-Dauerauftragsbestand rückmelden)
 * Section C.10.2.3.4
 */
export class HICDB extends SegmentClass(HICDBProps) {
    public type = "HICDB";

    protected serialize(): string[][] {
        throw new Error("Not implemented.");
    }

    protected deserialize(input: string[][]) {
        const [[], [], [sepaMessage], [], [nextOrder, timeUnit, interval, orderDay, lastOrder]] = input;

        const parsed: unknown = Parse.xml(sepaMessage);

        if (!this.isDocument(parsed)) {
            throw new Error("Received sepa-message seems not to be a valid 'Document' object!");
        }

        const jsonMessage: CustomerCreditTransferInitiationV03 = parsed.Document.CstmrCdtTrfInitn;
        const instructionInfo: PaymentInstructionInformationSCT = Array.isArray(jsonMessage.PmtInf)
            ? jsonMessage.PmtInf[0]
            : (jsonMessage.PmtInf as PaymentInstructionInformationSCT);
        const creditTransaction: CreditTransferTransactionInformationSCT = Array.isArray(instructionInfo.CdtTrfTxInf)
            ? instructionInfo.CdtTrfTxInf[0]
            : (instructionInfo.CdtTrfTxInf as CreditTransferTransactionInformationSCT);

        this.standingOrder = {
            nextOrderDate: Parse.date(nextOrder),
            timeUnit,
            interval: Parse.num(interval),
            orderDay: Parse.num(orderDay),
            lastOrderDate: lastOrder ? Parse.date(lastOrder) : undefined,
            creationDate: new Date(jsonMessage.GrpHdr.CreDtTm),
            amount: jsonMessage.GrpHdr.CtrlSum || 0,
            paymentPurpose: creditTransaction.RmtInf?.Ustrd || "",
            debitor: {
                name: instructionInfo.Dbtr.Nm,
                iban: instructionInfo.DbtrAcct.Id.IBAN,
                bic: instructionInfo.DbtrAgt.FinInstnId.BIC,
            },
            creditor: {
                name: creditTransaction.Cdtr.Nm,
                iban: creditTransaction.CdtrAcct.Id.IBAN,
                bic: creditTransaction.CdtrAgt?.FinInstnId.BIC || "",
            },
        };
    }

    private isDocument(d: unknown): d is document {
        return (
            typeof d !== "undefined" &&
            d !== null &&
            typeof (d as { Document?: unknown }).Document !== "undefined" &&
            (d as { Document?: { CstmrCdtTrfInitn?: unknown } }).Document?.CstmrCdtTrfInitn !== "undefined"
        );
    }
}
