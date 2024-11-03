const express = require("express");
const db = require("../data/db");
const router = express.Router();
const axios = require('axios');
const https = require('https');
const cron = require('node-cron');

router.use("/seviye-ogrenme-testi", async (req, res) => {
    res.render('learn-level');
});

router.use("/seviye-ogren", async (req, res) => {
    try {
        var [data,] = await db.execute("SELECT * FROM words WHERE level IN ('A', 'A+', 'A++') ORDER BY RAND() LIMIT 9");
        var [dataB,] = await db.execute("SELECT * FROM words WHERE level IN ('B', 'B+', 'B++') ORDER BY RAND() LIMIT 6");
        var [dataC,] = await db.execute("SELECT * FROM words WHERE level IN ('C', 'C+', 'C++') ORDER BY RAND() LIMIT 5");

        data.forEach(item => item.point = 1);
        dataB.forEach(item => item.point = 2);
        dataC.forEach(item => item.point = 3);
        var combinedData = [...data, ...dataB, ...dataC];

        res.json(combinedData);
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/create_box', async (req, res) => {

    const { boxId, words } = req.body;

    try {
        await db.query(`
            INSERT INTO create_box (id, words)
            VALUES (?, ?)
        `, [boxId, JSON.stringify(words)]);

        res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

router.get("/fetch/kategori_:box_name", async (req, res) => {
    try {
        const [data,] = await db.execute("SELECT * FROM categories WHERE category = ? ORDER BY RAND() LIMIT 10", [req.params.box_name]);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.use("/kategori_:box_name", async (req, res) => {
    try {
        const [data,] = await db.execute("SELECT * FROM categories  where category = ?", [req.params.box_name]);
        res.render("boxes");
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/fetch/seviye_:box_name", async (req, res) => {
    try {
        const [data,] = await db.execute("SELECT * FROM words WHERE level = ? ORDER BY RAND() LIMIT 10", [req.params.box_name]);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.use("/seviye_:box_name", async (req, res) => {
    try {
        const [data,] = await db.execute("SELECT * FROM words  where level = ?", [req.params.box_name]);
        res.render("boxes", { data: data });
    }
    catch (err) {
        console.log(err);
    }
});

router.use("/box_create/:box_id", async (req, res) => {

    try {
        const [data,] = await db.execute("SELECT words FROM create_box  where id = ?", [req.params.box_id]);
        res.json(data[0].words);
    }
    catch (err) {
        console.log(err);
    }
});

router.use("/kutum/:box_id", async (req, res) => {
    res.render("idbox", { box_id: req.params.box_id });
});

router.use("/kutum", (req, res) => {
    res.render("mybox");
});

router.use("/a", (req, res) => {
    res.render("a");
});

router.use("/aa", (req, res) => {
    res.render("aa");
});

const blogPosts = [
    { title: 'Irregular Verbs (Düzensiz Fiiler)', content: 'irregular-verbs' },
    { title: 'Future Tense (Gelecek Zaman)', content: 'future-tense' },
    { title: 'Present Tense (Şimdiki Zaman)', content: 'present-tense' },
    { title: 'Past Tense (Geçmiş Zaman)', content: 'past-tense'},
    { title: 'Pronouns (Zamirler)', content: 'pronouns'},
    { title: 'Make-Do-Play Arasındaki Farklar', content: 'make-do-play' },
    { title: 'Been to - Gone to Farkı Nedir?', content: 'been-gone' },
    { title: 'a/an/the Nerelerde Kullanılır?', content: 'a-an-the' },
    { title: 'Preposition(Edatlar,at-in-on)', content: 'preposition' },

];

router.get('/learn-english/:page', (req, res) => {
    const { page } = req.params;
    res.render(`partials/${page}`, { blogPosts });
});

router.use('/learn-english', (req, res) => {
    res.render('learn-english', { blogPosts });
});

router.use('/b', (req, res) => {
    // Eşleştirilecek kelimeler ve anlamlar
    const words = [
        { word: "Teacher", definition: "Someone who teaches" },
        { word: "Doctor", definition: "Someone who treats patients" },
        { word: "Engineer", definition: "Someone who designs structures" },
        { word: "Artist", definition: "Someone who creates art" },
        { word: "Chef", definition: "Someone who cooks food" },
        { word: "Pilot", definition: "Someone who flies airplanes" },
        { word: "Nurse", definition: "Someone who cares for patients" },
        { word: "Writer", definition: "Someone who writes books or articles" }
      ];
      
  
    res.render('b', { words });
  });

router.use("/kelime-yarismasi", async (req, res) => {
    const query = "SELECT level FROM words  GROUP BY level ORDER BY level ASC;";
    const queryTrCategory = "SELECT turkish FROM t_category ORDER BY turkish ASC";

    try {
        const [data,] = await db.execute(query);
        const [turkishCategory,] = await db.execute(queryTrCategory);
            
        res.render("room", {
            level: data,
            category: turkishCategory,
        });


    } catch (err) {
        console.log(err);
    }

});

router.get("/sitemap.xml", (req, res) => {
    res.sendFile("sitemap.xml", { root: __dirname });
});

router.get("/robots.txt", (req, res) => {
    res.sendFile("robots.txt", { root: __dirname });
});

router.use("/gizlilik-politikasi",(req,res)=>{
    res.render("privacy");
})

// router.use('/etrsoft_odev', async (req, res) => {
//     try {
//         cron.schedule('*/30 * * * *', fetchDataAndUpdateDB);
//         const query = `
//       SELECT 
//     hesap_kodu, 
//     borcu,
//     SUBSTRING_INDEX(hesap_kodu, '.', 1) AS level_1,
//     SUBSTRING_INDEX(hesap_kodu, '.', 2) AS level_2
// FROM 
//     data
// ORDER BY 
//     hesap_kodu;

//   `;

//         const [rows] = await db.execute(query);
//         res.render('etr', { data: rows });
//     } catch (error) {
//         console.error('Veri çekme hatası:', error.message);
//         res.status(500).send('Veri çekme işlemi başarısız.');
//     }
// });

router.use("/", async (req, res) => {
    const query = "SELECT level, COUNT(*) AS count FROM words  GROUP BY level ORDER BY level ASC;";
    const queryCategory = "SELECT category, COUNT(*) AS count FROM categories  GROUP BY category ORDER BY category ASC;";
    const queryTrCategory = "SELECT english,turkish FROM t_category";

    try {
        const [data,] = await db.execute(query);
        const [dataCategory,] = await db.execute(queryCategory);
        const [turkishCategory,] = await db.execute(queryTrCategory);


        res.render("index", {
            words: data,
            words_category: dataCategory,
            words_TrCategory: turkishCategory,
        });
    }
    catch (err) {
        console.log(err);
    }

});

// const agent = new https.Agent({
//     rejectUnauthorized: false
// });

// const username = 'apitest';
// const password = 'test123';

// async function fetchDataAndUpdateDB() {
//     try {
//         const tokenResponse = await axios.post(
//             'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions',
//             {},
//             {
//                 httpsAgent: agent,
//                 headers: {
//                     'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         const token = tokenResponse.data.response.token;
//         const dataResponse = await axios.patch(
//             'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1',
//             {
//                 "fieldData": {},
//                 "script": "getData"
//             },
//             {
//                 httpsAgent: agent,
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );

//         const data = dataResponse.data.response.scriptResult;
//         const fetchedData = JSON.parse(data);

//         for (const item of fetchedData) {
//             const hesap_kodu = item.hesap_kodu;
//             const borc = item.borc === '' ? 0 : parseFloat(item.borc);

//             const [checkResult] = await db.execute('SELECT COUNT(*) AS count FROM data WHERE hesap_kodu = ?', [hesap_kodu]);

//             if (checkResult[0].count > 0) {
//                 await db.execute('UPDATE data SET borcu = ? WHERE hesap_kodu = ?', [borc, hesap_kodu]);
//             } else {
//                 await db.execute('INSERT INTO data (hesap_kodu, borcu) VALUES (?, ?)', [hesap_kodu, borc]);
//             }
//         }
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

module.exports = router;