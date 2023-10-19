module NSX.SPO {

    export class ContextWebInformation {
        formDigestTimeoutSeconds: number;
        formDigestValue: string;
        libraryVersion: string;
        siteFullUrl: string;
        webFullUrl: string;

        constructor (j: any) {
            this.formDigestTimeoutSeconds = j.formDigestTimeoutSeconds;
            this.formDigestValue = j.formDigestValue;
            this.libraryVersion = j.libraryVersion;
            this.siteFullUrl = j.siteFullUrl;
            this.webFullUrl = j.webFullUrl;
        }
    }

    export class Query {
        public static async getRequestDigest (siteUrl: string): Promise<ContextWebInformation> {
            const url = `${siteUrl}_api/contextinfo`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    "Accept": "application/json; odata=nometadata",
                    "Content-Type": "application/json;odata=nometadata"
                },
                credentials: 'same-origin'
            });
            if (!response.ok) console.log(`Fetch error on: ${url}`);
            return new ContextWebInformation ((await response.json()).d.GetContextWebInformation);
        }
        
        public static async getSpItems (siteUrl: string, listName: string, query: string): Promise<JSON> {
            const url = `${siteUrl}_api/web/lists/GetByTitle('${listName}')/items${query}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { "Accept": "application/json; odata=verbose" },
                credentials: 'same-origin'
            });
            if (!response.ok) console.log(`Fetch error on: ${url}`);
            return await response.json();
        }
        
        public static async createSpItem (siteUrl: string, listName: string, itemProperties: string): Promise<boolean> {
            const token: ContextWebInformation = await this.getRequestDigest(siteUrl);
            const url = `${siteUrl}_api/web/lists/getbytitle('${listName}')/items`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json",
                    "X-RequestDigest": token.formDigestValue
                },
                body: JSON.stringify(itemProperties)
            });
            return response.ok;
        }
        
        public static async editSpItem (siteUrl: string, listName: string, id: number, itemProperties: string, etag: string): Promise<boolean> {
            const token: ContextWebInformation = await this.getRequestDigest(siteUrl);
            const url = `${siteUrl}_api/web/lists/GetByTitle('${listName}')/items('${id}')`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json",
                    "X-RequestDigest": token.formDigestValue,
                    "If-Match": `"${etag}"`,
                    "X-HTTP-Method": "MERGE"
                }, 
                body: JSON.stringify(itemProperties)
            });
            return response.ok;
        }
    }          
}
