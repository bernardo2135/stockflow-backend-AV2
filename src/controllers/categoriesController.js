
import { supabase } from '../config/supabase.js';

// Listar categorias
export const getCategories = async (req, res) => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(data);
};

// Visualizar categoria
export const getCategory = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({
            error: 'Categoria não encontrada'
        });
    }

    res.json(data);
};

// Cadastrar categoria
export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            error: 'O nome da categoria é obrigatório'
        });
    }

    const { data, error } = await supabase
        .from('categories')
        .insert({
            name: name.trim(),
            description: description || null
        })
        .select()
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
};

// Editar categoria
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            error: 'O nome da categoria é obrigatório'
        });
    }

    const { data, error } = await supabase
        .from('categories')
        .update({
            name: name.trim(),
            description: description || null
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({
            error: 'Categoria não encontrada'
        });
    }

    res.json(data);
};

// Excluir categoria
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    const { count, error: checkError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', id);

    if (checkError) {
        return res.status(500).json({
            error: checkError.message
        });
    }

    if (count > 0) {
        return res.status(409).json({
            error: 'Existem produtos vinculados a esta categoria'
        });
    }

    const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({
            error: 'Categoria não encontrada'
        });
    }

    res.json({
        message: 'Categoria excluída com sucesso!'
    });
};
