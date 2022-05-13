import scrapeIt from "scrape-it";

interface ScrapItDataRes {
    data: {
        price: string;
    };
}

export const inrToUsdRate = async () => {
    const { data } = (
        await scrapeIt("https://www.google.com/finance/quote/USD-INR?hl=en", {
            price: "div.AHmHk span div.kf1m0 .fxKbKc",
        })
    ) as unknown as ScrapItDataRes;

    return data.price;
};
