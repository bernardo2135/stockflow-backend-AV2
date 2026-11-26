
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { supabase } from './config/supabase.js';

import productsRoutes from './routes/productsRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import suppliersRoutes from './routes/suppliersRoutes.js';

import movementsRoutes from './routes/movementsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: 'StockFlow API funcionando!',
        status: 'online'
    });
});

// Testar conexão com Supabase
app.get('/api/test', async (req, res) => {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json({
        message: 'Conexão com Supabase realizada!',
        categories: data
    });
});

// Rotas do sistema
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/movements', movementsRoutes);

// Iniciar servidor
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`StockFlow API rodando na porta ${PORT}`);
    });
}

export default app;