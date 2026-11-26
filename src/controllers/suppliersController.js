
import { supabase } from '../config/supabase.js';

// Listar fornecedores
export const getSuppliers = async (req, res) => {
    const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    res.json(data);
};

// Visualizar fornecedor
export const getSupplier = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        return res.status(500).json({
            error: error.message
        });
    }

    if (!data) {
        return res.status(404).json({
            error: 'Fornecedor não encontrado'
        });
    }

    res.json(data);
};

// Cadastrar fornecedor
export const createSupplier = async (req, res) => {
    const { name, email, phone, address } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            error: 'O nome do fornecedor é obrigatório'
        });
    }

    const { data, error } = await supabase
        .from('suppliers')
        .insert({
            name: name.trim(),
            email: email || null,
            phone: phone || null,
            address: address || null
        })
        .select()
        .single();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    res.status(201).json(data);
};

// Editar fornecedor
export const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            error: 'O nome do fornecedor é obrigatório'
        });
    }

    const { data, error } = await supabase
        .from('suppliers')
        .update({
            name: name.trim(),
            email: email || null,
            phone: phone || null,
            address: address || null
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    if (!data) {
        return res.status(404).json({
            error: 'Fornecedor não encontrado'
        });
    }

    res.json(data);
};

// Excluir fornecedor
export const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    const { count, error: checkError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('supplier_id', id);

    if (checkError) {
        return res.status(500).json({
            error: checkError.message
        });
    }

    if (count > 0) {
        return res.status(409).json({
            error: 'Existem produtos vinculados a este fornecedor'
        });
    }

    const { data, error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

    if (error) {
        return res.status(400).json({
            error: error.message
        });
    }

    if (!data) {
        return res.status(404).json({
            error: 'Fornecedor não encontrado'
        });
    }

    res.json({
        message: 'Fornecedor excluído com sucesso!'
    });
};
