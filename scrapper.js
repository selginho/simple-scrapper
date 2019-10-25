const axios = require("axios");
const cheerio = require("cheerio");

function getDecodedToken(token) {
  const replacements = {
    a: "\x7a",
    b: "\x79",
    c: "\x78",
    d: "\x77",
    e: "\x76",
    f: "\x75",
    g: "\x74",
    h: "\x73",
    i: "\x72",
    j: "\x71",
    k: "\x70",
    l: "\x6f",
    m: "\x6e",
    n: "\x6d",
    o: "\x6c",
    p: "\x6b",
    q: "\x6a",
    r: "\x69",
    s: "\x68",
    t: "\x67",
    u: "\x66",
    v: "\x65",
    w: "\x64",
    x: "\x63",
    y: "\x62",
    z: "\x61",
    "0": "\x39",
    "1": "\x38",
    "2": "\x37",
    "3": "\x36",
    "4": "\x35",
    "5": "\x34",
    "6": "\x33",
    "7": "\x32",
    "8": "\x31",
    "9": "\x30"
  };

  for (var e = token.split(""), t = 0; t < e.length; t++) {
    e[t] = replacements.hasOwnProperty(e[t]) ? replacements[e[t]] : e[t];
  }

  e = e.join("");
  return e;
}

(async () => {
  const firstPage = await axios.get(
    "http://applicant-test.us-east-1.elasticbeanstalk.com/"
  );

  const cookie = firstPage.headers["set-cookie"][0].split(";")[0];
  const firstBody = cheerio.load(firstPage.data);

  const token = firstBody("#form #token").val();
  const decodedToken = getDecodedToken(token);

  const secondPage = await axios.post(
    `http://applicant-test.us-east-1.elasticbeanstalk.com`,
    `token=${decodedToken}`,
    {
      headers: {
        Cookie: cookie,
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Upgrade-Insecure-Requests": 1,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        Referer: "http://applicant-test.us-east-1.elasticbeanstalk.com/",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    }
  );

  const secondBody = cheerio.load(secondPage.data);
  const answer = secondBody("#answer").text();

  console.log(`A resposta é: ${answer}`);
})();
