import { supabase } from '../config/supabase.js';

export async function getMovements(req, res) {
    try {
        const { data, error } = await supabase.from('stock_movements')
            .select('id,product_id,type,quantity,description,created_at,products(name,sku)')
            .order('id', { ascending: false }).range(0, 99);
        if (error) throw error;
        res.json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
}

export async function createMovement(req, res) {
    const { product_id, type, quantity, description } = req.body || {};
    if (!Number.isSafeInteger(product_id) || product_id <= 0 ||
        !['entrada', 'saida'].includes(type) || !Number.isInteger(quantity) ||
        quantity <= 0 || quantity > 2147483647 ||
        (description != null && typeof description !== 'string')) {
        return res.status(400).json({ error: 'Informe produto, tipo e quantidade válidos.' });
    }
    try {
        const { data, error } = await supabase.rpc('register_stock_movement', {
            p_product_id: product_id, p_type: type, p_quantity: quantity,
            p_description: description?.trim() || null
        });
        if (error) return res.status(error.code === 'P0001' || error.code === '23503' ? 400 : 500).json({ error: error.message });
        res.status(201).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
}
