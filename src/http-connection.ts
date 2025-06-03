import { Request } from "./request";
import { Response } from "./response";
import { Connection } from "./types";
import { decodeBase64, encodeBase64 } from "./utils";

/**
 * Configuration specifying how to reach the fints server.
 */
export class ConnectionConfig {
    /**
     * The URL to reach the server at.
     */
    public url: string;
    /**
     * If set to `true`, will log all requests performed and responses received.
     */
    public debug = false;
}

/**
 * A connection used by clients to reach the fints server.
 */
export class HttpConnection extends ConnectionConfig implements Connection {
    constructor(config: ConnectionConfig) {
        super();
        Object.assign(this, config);
    }

    public async send(request: Request): Promise<Response> {
        const { url } = this;
        if (this.debug) {
            console.log(`Sending Request: ${request}`);
            console.log(`Parsed Request:\n${request.debugString}`);
        }
        const httpRequest = await fetch(url, {
            method: "POST",
            body: encodeBase64(String(request)),
        });
        if (!httpRequest.ok) {
            throw new Error(`Received bad status code ${httpRequest.status} from FinTS endpoint.`);
        }

        const responseString = decodeBase64(await httpRequest.text());
        if (this.debug) {
            console.log(`Received Response: ${responseString}`);
            console.log(`Parsed Response:\n${new Response(responseString).debugString}`);
        }
        const response = new Response(responseString);
        return response;
    }
}
