import scrapeIt from "scrape-it";

export const inrToUsdRate = async () => {
    const { data } = await scrapeIt(
        "https://www.google.com/finance/quote/USD-INR?hl=en",
        {
            price: "div.AHmHk span div.kf1m0 .fxKbKc",
        }
    ) as unknown as { data: { price: string; }; };

    return data.price;
};
