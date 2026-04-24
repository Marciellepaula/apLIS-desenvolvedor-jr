<?php

declare(strict_types=1);

namespace App\I18n;

final class Translator
{
    private array $translations = [
        'pt' => [
            'doctor.created' => 'Médico criado com sucesso',
            'doctor.updated' => 'Médico atualizado com sucesso',
            'doctor.deleted' => 'Médico excluído com sucesso',
            'doctor.not_found' => 'Médico não encontrado',
            'doctor.list_failed' => 'Falha ao listar médicos',
            'doctor.create_failed' => 'Falha ao criar médico',
            'doctor.update_failed' => 'Falha ao atualizar médico',
            'doctor.delete_failed' => 'Falha ao excluir médico',
            'patient.created' => 'Paciente criado com sucesso',
            'patient.updated' => 'Paciente atualizado com sucesso',
            'patient.deleted' => 'Paciente excluído com sucesso',
            'patient.not_found' => 'Paciente não encontrado',
            'patient.list_failed' => 'Falha ao listar pacientes',
            'patient.create_failed' => 'Falha ao criar paciente',
            'patient.update_failed' => 'Falha ao atualizar paciente',
            'patient.delete_failed' => 'Falha ao excluir paciente',
        ],
        'en' => [
            'doctor.created' => 'Doctor created successfully',
            'doctor.updated' => 'Doctor updated successfully',
            'doctor.deleted' => 'Doctor deleted successfully',
            'doctor.not_found' => 'Doctor not found',
            'doctor.list_failed' => 'Failed to list doctors',
            'doctor.create_failed' => 'Failed to create doctor',
            'doctor.update_failed' => 'Failed to update doctor',
            'doctor.delete_failed' => 'Failed to delete doctor',
            'patient.created' => 'Patient created successfully',
            'patient.updated' => 'Patient updated successfully',
            'patient.deleted' => 'Patient deleted successfully',
            'patient.not_found' => 'Patient not found',
            'patient.list_failed' => 'Failed to list patients',
            'patient.create_failed' => 'Failed to create patient',
            'patient.update_failed' => 'Failed to update patient',
            'patient.delete_failed' => 'Failed to delete patient',
        ],
    ];

    public function translate(string $key, string $lang = 'pt'): string
    {
        return $this->translations[$lang][$key] ?? $key;
    }

    public static function detectLanguage(array $headers): string
    {
        $acceptLanguage = $headers['Accept-Language'] ?? $headers['accept-language'] ?? 'pt';
        
        // Extract primary language (e.g., 'pt' from 'pt-BR,en-US;q=0.9')
        $languages = explode(',', $acceptLanguage);
        $primaryLang = strtolower(trim(explode('-', $languages[0])[0]));
        
        // Return supported language or default to 'pt'
        return in_array($primaryLang, ['pt', 'en']) ? $primaryLang : 'pt';
    }
}
