const messages = {
  pt: {
    'patient.created': 'Paciente criado com sucesso',
    'patient.updated': 'Paciente atualizado com sucesso',
    'patient.deleted': 'Paciente excluído com sucesso',
    'patient.found': 'Paciente encontrado',
    'patient.not_found': 'Paciente não encontrado',
    'patient.list_failed': 'Falha ao listar pacientes',
    'patient.create_failed': 'Falha ao criar paciente',
    'patient.update_failed': 'Falha ao atualizar paciente',
    'patient.delete_failed': 'Falha ao excluir paciente',
    'error.unexpected': 'Erro inesperado',
  },
  en: {
    'patient.created': 'Patient created successfully',
    'patient.updated': 'Patient updated successfully',
    'patient.deleted': 'Patient deleted successfully',
    'patient.found': 'Patient found',
    'patient.not_found': 'Patient not found',
    'patient.list_failed': 'Failed to list patients',
    'patient.create_failed': 'Failed to create patient',
    'patient.update_failed': 'Failed to update patient',
    'patient.delete_failed': 'Failed to delete patient',
    'error.unexpected': 'Unexpected error',
  },
};

export function detectLang(req) {
  const header = req.headers['accept-language'] ?? 'pt';
  const primary = header.split(',')[0].split('-')[0].toLowerCase();
  return ['pt', 'en'].includes(primary) ? primary : 'pt';
}

export function translate(key, lang = 'pt') {
  return messages[lang]?.[key] ?? key;
}
