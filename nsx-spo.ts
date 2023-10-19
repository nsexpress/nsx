module NSX.SPO {

    export class Query {
        public static async getRequestDigest (siteUrl: string): Promise<string> {
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
            let json = await response.json();
            return json.FormDigestValue;
        }
        
        public static async getSpItems (siteUrl: string, listName: string, query: string): Promise<JSON> {
            const url:string = `${siteUrl}_api/web/lists/GetByTitle('${listName}')/items${query}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { "Accept": "application/json; odata=verbose" },
                credentials: 'same-origin'
            });
            if (!response.ok) console.log(`Fetch error on: ${url}`);
            return await response.json();
        }
        
        public static async createSpItem (siteUrl: string, listName: string, itemProperties: string): Promise<boolean> {
            const token:string = await this.getRequestDigest(siteUrl);
            const url:string = `${siteUrl}_api/web/lists/getbytitle('${listName}')/items`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json",
                    "X-RequestDigest": token
                },
                body: JSON.stringify(itemProperties)
            });
            return response.ok;
        }
        
        public static async editSpItem (siteUrl: string, listName: string, id: number, itemProperties: string, etag: string): Promise<boolean> {
            const token:string = await this.getRequestDigest(siteUrl);
            const url:string = `${siteUrl}_api/web/lists/GetByTitle('${listName}')/items('${id}')`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json",
                    "X-RequestDigest": token,
                    "If-Match": `"${etag}"`,
                    "X-HTTP-Method": "MERGE"
                }, 
                body: JSON.stringify(itemProperties)
            });
            return response.ok;
        }
    }          
}
