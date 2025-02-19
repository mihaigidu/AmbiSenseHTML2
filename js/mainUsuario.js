const API_KEY = "pub_69144306a0da375dd43f0c86ac65e851680f8";
        const API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=salud%20en%20las%20aulas&country=es`;
        let cachedArticles = [];
        let currentIndex = 0;

        async function fetchNews() {
            try {
                console.log("🔄 Intentando cargar noticias...");
                const response = await fetch(API_URL);
                const data = await response.json();

                if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
                    if (cachedArticles.length > 0) {
                        console.warn("⚠️ La API no devolvió noticias nuevas. Mostrando noticias anteriores.");
                        displayNews();
                        return;
                    } else {
                        throw new Error("No hay noticias disponibles en este momento.");
                    }
                }

                let uniqueArticles = Array.from(new Set(data.results.map(a => a.title)))
                    .map(title => data.results.find(a => a.title === title));

                cachedArticles = shuffleArray(uniqueArticles).slice(0, 5);
                currentIndex = 0; // Reiniciar índice al recibir nuevas noticias
                displayNews();

            } catch (error) {
                console.error("⚠️ Error al cargar noticias:", error);
                if (cachedArticles.length > 0) {
                    console.warn("⚠️ Error en la API, pero mostrando noticias anteriores.");
                    displayNews();
                } else {
                    document.getElementById("news-container").innerHTML = `<p>Error: ${error.message}</p>`;
                }
            }
        }

        function displayNews() {
            let newsContainer = document.getElementById("news-container");
            if (cachedArticles.length > 0) {
                const article = cachedArticles[currentIndex];
                newsContainer.innerHTML = `
                    <h3>${article.title}</h3>
                    <p>${article.description || "No hay descripción disponible."}</p>
                    <a href="${article.link}" target="_blank">Leer más</a>
                `;
            } else {
                newsContainer.innerHTML = `<p>No hay noticias disponibles.</p>`;
            }
        }

        document.getElementById("prevNews").addEventListener("click", () => {
            if (cachedArticles.length > 0) {
                currentIndex = (currentIndex - 1 + cachedArticles.length) % cachedArticles.length;
                displayNews();
            }
        });

        document.getElementById("nextNews").addEventListener("click", () => {
            if (cachedArticles.length > 0) {
                currentIndex = (currentIndex + 1) % cachedArticles.length;
                displayNews();
            }
        });

        function shuffleArray(array) {
            return array.sort(() => Math.random() - 0.5);
        }

        fetchNews();
        setInterval(fetchNews, 300000);