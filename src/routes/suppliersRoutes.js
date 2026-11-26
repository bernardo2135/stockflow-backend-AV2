
import express from 'express';

import {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from '../controllers/suppliersController.js';

const router = express.Router();

// Listar fornecedores
router.get('/', getSuppliers);

// Visualizar fornecedor
router.get('/:id', getSupplier);

// Cadastrar fornecedor
router.post('/', createSupplier);

// Editar fornecedor
router.put('/:id', updateSupplier);

// Excluir fornecedor
router.delete('/:id', deleteSupplier);

export default router;
