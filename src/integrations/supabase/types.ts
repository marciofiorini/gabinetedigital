export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alertas_automaticos: {
        Row: {
          ativo: boolean
          condicao: string
          created_at: string
          id: string
          metrica: string
          nome: string
          tipo: string
          updated_at: string
          user_id: string
          valor_limite: number
        }
        Insert: {
          ativo?: boolean
          condicao: string
          created_at?: string
          id?: string
          metrica: string
          nome: string
          tipo: string
          updated_at?: string
          user_id: string
          valor_limite?: number
        }
        Update: {
          ativo?: boolean
          condicao?: string
          created_at?: string
          id?: string
          metrica?: string
          nome?: string
          tipo?: string
          updated_at?: string
          user_id?: string
          valor_limite?: number
        }
        Relationships: []
      }
      comparativos_temporais: {
        Row: {
          candidato_nome: string
          created_at: string
          id: string
          metrica: string
          observacoes: string | null
          periodo_final: string
          periodo_inicial: string
          tipo_dado: string
          updated_at: string
          user_id: string
          valor_final: number | null
          valor_inicial: number | null
          variacao_absoluta: number | null
          variacao_percentual: number | null
        }
        Insert: {
          candidato_nome: string
          created_at?: string
          id?: string
          metrica: string
          observacoes?: string | null
          periodo_final: string
          periodo_inicial: string
          tipo_dado: string
          updated_at?: string
          user_id: string
          valor_final?: number | null
          valor_inicial?: number | null
          variacao_absoluta?: number | null
          variacao_percentual?: number | null
        }
        Update: {
          candidato_nome?: string
          created_at?: string
          id?: string
          metrica?: string
          observacoes?: string | null
          periodo_final?: string
          periodo_inicial?: string
          tipo_dado?: string
          updated_at?: string
          user_id?: string
          valor_final?: number | null
          valor_inicial?: number | null
          variacao_absoluta?: number | null
          variacao_percentual?: number | null
        }
        Relationships: []
      }
      configuracoes_monitoramento: {
        Row: {
          ativo: boolean | null
          candidato_nome: string
          configuracoes_extras: Json | null
          created_at: string
          frequencia_atualizacao: string | null
          id: string
          tipo_monitoramento: string
          ultima_atualizacao: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          candidato_nome: string
          configuracoes_extras?: Json | null
          created_at?: string
          frequencia_atualizacao?: string | null
          id?: string
          tipo_monitoramento: string
          ultima_atualizacao?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          candidato_nome?: string
          configuracoes_extras?: Json | null
          created_at?: string
          frequencia_atualizacao?: string | null
          id?: string
          tipo_monitoramento?: string
          ultima_atualizacao?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          tags: string[] | null
          telefone: string | null
          updated_at: string | null
          user_id: string
          zona: string | null
        }
        Insert: {
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
          zona?: string | null
        }
        Update: {
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          tags?: string[] | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
          zona?: string | null
        }
        Relationships: []
      }
      dados_eleitorais: {
        Row: {
          ano_eleicao: number
          bairro: string | null
          candidato_nome: string
          candidato_numero: string | null
          cargo: string
          created_at: string
          estado: string
          id: string
          is_candidato_proprio: boolean | null
          municipio: string
          partido: string | null
          percentual_votos: number | null
          posicao_ranking: number | null
          secao_eleitoral: string | null
          situacao: string | null
          total_votos: number | null
          updated_at: string
          user_id: string
          votos_legenda: number | null
          votos_nominais: number | null
          zona_eleitoral: string | null
        }
        Insert: {
          ano_eleicao: number
          bairro?: string | null
          candidato_nome: string
          candidato_numero?: string | null
          cargo: string
          created_at?: string
          estado: string
          id?: string
          is_candidato_proprio?: boolean | null
          municipio: string
          partido?: string | null
          percentual_votos?: number | null
          posicao_ranking?: number | null
          secao_eleitoral?: string | null
          situacao?: string | null
          total_votos?: number | null
          updated_at?: string
          user_id: string
          votos_legenda?: number | null
          votos_nominais?: number | null
          zona_eleitoral?: string | null
        }
        Update: {
          ano_eleicao?: number
          bairro?: string | null
          candidato_nome?: string
          candidato_numero?: string | null
          cargo?: string
          created_at?: string
          estado?: string
          id?: string
          is_candidato_proprio?: boolean | null
          municipio?: string
          partido?: string | null
          percentual_votos?: number | null
          posicao_ranking?: number | null
          secao_eleitoral?: string | null
          situacao?: string | null
          total_votos?: number | null
          updated_at?: string
          user_id?: string
          votos_legenda?: number | null
          votos_nominais?: number | null
          zona_eleitoral?: string | null
        }
        Relationships: []
      }
      dados_redes_sociais: {
        Row: {
          candidato_nome: string
          comentarios_totais: number | null
          compartilhamentos_totais: number | null
          created_at: string
          curtidas_totais: number | null
          data_coleta: string
          engajamento_medio: number | null
          handle_usuario: string | null
          id: string
          is_candidato_proprio: boolean | null
          publicacoes: number | null
          rede_social: string
          seguidores: number | null
          seguindo: number | null
          updated_at: string
          url_perfil: string | null
          user_id: string
        }
        Insert: {
          candidato_nome: string
          comentarios_totais?: number | null
          compartilhamentos_totais?: number | null
          created_at?: string
          curtidas_totais?: number | null
          data_coleta: string
          engajamento_medio?: number | null
          handle_usuario?: string | null
          id?: string
          is_candidato_proprio?: boolean | null
          publicacoes?: number | null
          rede_social: string
          seguidores?: number | null
          seguindo?: number | null
          updated_at?: string
          url_perfil?: string | null
          user_id: string
        }
        Update: {
          candidato_nome?: string
          comentarios_totais?: number | null
          compartilhamentos_totais?: number | null
          created_at?: string
          curtidas_totais?: number | null
          data_coleta?: string
          engajamento_medio?: number | null
          handle_usuario?: string | null
          id?: string
          is_candidato_proprio?: boolean | null
          publicacoes?: number | null
          rede_social?: string
          seguidores?: number | null
          seguindo?: number | null
          updated_at?: string
          url_perfil?: string | null
          user_id?: string
        }
        Relationships: []
      }
      demandas: {
        Row: {
          categoria: string | null
          created_at: string | null
          data_limite: string | null
          descricao: string | null
          id: string
          prioridade: string | null
          solicitante: string | null
          status: string | null
          titulo: string
          updated_at: string | null
          user_id: string
          zona: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          data_limite?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          solicitante?: string | null
          status?: string | null
          titulo: string
          updated_at?: string | null
          user_id: string
          zona?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          data_limite?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string | null
          solicitante?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string | null
          user_id?: string
          zona?: string | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string | null
          data_hora: string
          descricao: string | null
          google_event_id: string | null
          id: string
          sincronizado: boolean | null
          tipo: string | null
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_hora: string
          descricao?: string | null
          google_event_id?: string | null
          id?: string
          sincronizado?: boolean | null
          tipo?: string | null
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_hora?: string
          descricao?: string | null
          google_event_id?: string | null
          id?: string
          sincronizado?: boolean | null
          tipo?: string | null
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      follow_ups: {
        Row: {
          assunto: string | null
          conteudo_mensagem: string | null
          created_at: string
          data_agendada: string
          descricao: string
          id: string
          lead_id: string | null
          observacoes: string | null
          status: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assunto?: string | null
          conteudo_mensagem?: string | null
          created_at?: string
          data_agendada: string
          descricao: string
          id?: string
          lead_id?: string | null
          observacoes?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assunto?: string | null
          conteudo_mensagem?: string | null
          created_at?: string
          data_agendada?: string
          descricao?: string
          id?: string
          lead_id?: string | null
          observacoes?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      keyboard_shortcuts: {
        Row: {
          action: string
          created_at: string
          id: string
          shortcut: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          shortcut: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          shortcut?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string | null
          fonte: string | null
          id: string
          interesse: string | null
          nome: string
          observacoes: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          fonte?: string | null
          id?: string
          interesse?: string | null
          nome: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          fonte?: string | null
          id?: string
          interesse?: string | null
          nome?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lideres: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          influencia: number | null
          nome: string
          observacoes: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string
          zona: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          influencia?: number | null
          nome: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
          zona: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          influencia?: number | null
          nome?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
          zona?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          dark_mode: boolean | null
          email_notifications: boolean | null
          id: string
          keyboard_shortcuts_enabled: boolean | null
          language: string | null
          push_notifications: boolean | null
          theme: string | null
          timezone: string | null
          tour_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          keyboard_shortcuts_enabled?: boolean | null
          language?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          tour_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          keyboard_shortcuts_enabled?: boolean | null
          language?: string | null
          push_notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
          tour_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_tours: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          tour_name: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          tour_name: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          tour_name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calcular_comparativo_temporal: {
        Args: {
          target_user_id: string
          candidato: string
          tipo: string
          metrica_nome: string
          data_inicio: string
          data_fim: string
        }
        Returns: {
          variacao_absoluta: number
          variacao_percentual: number
          valor_inicial: number
          valor_final: number
        }[]
      }
      current_user_has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      get_dashboard_stats: {
        Args: { target_user_id: string }
        Returns: {
          demandas_pendentes: number
          eventos_hoje: number
          novos_contatos_hoje: number
          leads_novos: number
        }[]
      }
      get_dashboard_stats_complete: {
        Args: { target_user_id: string }
        Returns: {
          demandas_pendentes: number
          eventos_hoje: number
          novos_contatos_hoje: number
          leads_novos: number
          aniversariantes_hoje: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_user_profile: {
        Args: { new_name: string; new_avatar_url?: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
