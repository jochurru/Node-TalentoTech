import axios from "axios";

// ─── Configuración de la API ─────────────────────────────────────────────────

const BASE_URL = "https://6a0259de0d92f63dd2539594.mockapi.io";

// Se capturan los argumentos desde la terminal:
// process.argv[0] = node | [1] = index.js | [2] = method | [3] = resource | [4+] = args

const [, , method, resource, ...args] = process.argv;

// ─── Funciones principales ───────────────────────────────────────────────────

// GET articles / GET articles/<id>
const getArticles = async (resource, args) => {
    if (args.length && isNaN(args[0])) {
        console.error("\n❌ El ID tiene que ser un número. Ejemplo: npm run start GET articles 3");
        return;
    }
    try {
        const { data } = await axios.get(`${BASE_URL}/${resourcePath}`);
if (Array.isArray(data)) {
    console.log(`\n Total de artículos: ${data.length}\n`);
    const tabla = data.map(({ id, name, price, description }) => ({
        ID: id,
        Nombre: name,
        Precio: `$${price}`,
        Descripción: description,
    }));
    console.table(tabla);
} else {
    const { id, name, price, description } = data;
    console.table({ ID: id, Nombre: name, Precio: `$${price}`, Descripción: description });
}
    } catch (error) {
        const status = error.response?.status;
        console.error(`\n❌ Error al obtener artículos. Status: ${status ?? "sin respuesta"}`);
    }
};

// POST articles <name> <price> <description>
const createArticle = async (resource, args) => {
    const [name, price, ...descParts] = args;
    const description = descParts.join(" ");

    if (!name || !price) {
        console.error("\n❌ Faltan datos. Uso: npm run start POST articles <name> <price> <description>");
        return;
    }
    if (isNaN(price)) {
        console.error("\n❌ El precio tiene que ser un número. Ejemplo: npm run start POST articles \"Remera\" 4500 \"descripcion\"");
        return;
    }
    try {
        const { data } = await axios.post(`${BASE_URL}/${resource}`, {
            name,
            price: Number(price),
            description,
        });

        console.log(`\n✅ Artículo creado exitosamente!`);
        console.log(`   ID         : ${data.id}`);
        console.log(`   Nombre     : ${data.name}`);
        console.log(`   Precio     : $${data.price}`);
        console.log(`   Descripción: ${data.description}`);
    } catch (error) {
        const status = error.response?.status;
        console.error(`\n❌ Error al crear el artículo. Status: ${status ?? "sin respuesta"}`);
    }
};

// DELETE articles/<id>
const deleteArticle = async (resource, args) => {
    if (!args.length) {
        console.error("\n❌ Tenés que indicar un ID. Ejemplo: npm run start DELETE articles 3");
        return;
    }
    if (isNaN(args[0])) {
        console.error("\n❌ El ID tiene que ser un número. Ejemplo: npm run start DELETE articles 3");
        return;
    }

    try {
        const { data } = await axios.delete(`${BASE_URL}/${resourcePath}`);

        console.log(`\n🗑️  Artículo eliminado exitosamente!`);
        console.log(`   ID: ${data.id} | Nombre: ${data.name}`);
    } catch (error) {
        const status = error.response?.status;
        console.error(`\n❌ Error al eliminar el artículo. Status: ${status ?? "sin respuesta"}`);
    }
};

// PATCH articles <id> <name> <price> <description>
const updateArticle = async (resource, args) => {
    const [id, name, price, ...descParts] = args;
    const description = descParts.join(" ");
    
    try {
        const { data } = await axios.patch(`${BASE_URL}/${resource}/${id}`, {
            name,
            price: Number(price),
            description,
        });

        console.log(`\n✏️  Artículo actualizado exitosamente!`);
        console.log(`   ID         : ${data.id}`);
        console.log(`   Nombre     : ${data.name}`);
        console.log(`   Precio     : $${data.price}`);
        console.log(`   Descripción: ${data.description}`);
    } catch (error) {
        const status = error.response?.status;
        console.error(`\n❌ Error al actualizar el artículo. Status: ${status ?? "sin respuesta"}`);
    }
};

// ─── Router de comandos ──────────────────────────────────────────────────────

const run = async () => {
    if (!method || !resource) {
        console.log(`
Uso:
    npm run start GET articles
    npm run start GET articles <id>
    npm run start POST articles <name> <price> <description>
    npm run start DELETE articles <id>
    npm run start PATCH articles <id> <name> <price> <description>
        `);
        return;
    }

    switch (method.toUpperCase()) {
        case "GET":
            await getArticles(resource, args);
            break;

        case "POST":
            await createArticle(resource, args);
            break;

        case "DELETE":
            await deleteArticle(resource, args);
            break;

        case "PATCH":
            await updateArticle(resource, args);
            break;

        default:
            console.error(`\n❌ Método no reconocido: "${method}". Usá GET, POST, DELETE o PATCH.`);
    }
};

run();