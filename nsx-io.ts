module NSX.IO {

    export class File {
        public static async getJson (url: string): Promise<JSON> {
            const response = await fetch(url, {
                method: 'GET',
                headers: { "Accept": "application/json; odata=verbose" },
                credentials: 'same-origin'
            });
            if (!response.ok) console.log(`Fetch error on: ${url}`);
            return await response.json();
        }
    }          
}
