
export interface FollowUp {
  id: string;
  user_id: string;
  lead_id?: string;
  tipo: 'ligacao' | 'mensagem' | 'reuniao' | 'aniversario';
  data_agendada: Date;
  descricao: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  observacoes?: string;
  assunto?: string;
  conteudo_mensagem?: string;
  lead_nome?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface NotificationSettings {
  alertas_follow_up: boolean;
  horas_antecedencia: number;
  enviar_email: boolean;
  enviar_push: boolean;
}
