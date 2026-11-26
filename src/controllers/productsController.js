
import { supabase } from '../config/supabase.js';

// Listar todos os produtos
export const getProducts = async (req, res) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
};

// Visualizar um produto
export const getProduct = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(data);
};

// Cadastrar produto
export const createProduct = async (req, res) => {
    const {
        name, description, sku, price,
        stock, min_stock, category_id, supplier_id
    } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            error: 'O nome do produto é obrigatório'
        });
    }

    const { data, error } = await supabase
        .from('products')
        .insert([{
            name, description, sku, price,
            stock, min_stock, category_id, supplier_id
        }])
        .select()
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
};

// Editar produto
export const updateProduct = async (req, res) => {
    const { id } = req.params;

    const allowed = [
        'name', 'description', 'sku', 'price',
        'min_stock', 'category_id', 'supplier_id'
    ];

    const changes = Object.fromEntries(
        Object.entries(req.body).filter(
            ([key]) => allowed.includes(key)
        )
    );

    const { data, error } = await supabase
        .from('products')
        .update({
            ...changes,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(data);
};

// Excluir produto
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto excluído com sucesso!' });
};
