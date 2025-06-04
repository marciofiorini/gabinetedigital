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
      access_logs: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          role_changed: string | null
          user_id: string
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          role_changed?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          role_changed?: string | null
          user_id?: string
        }
        Relationships: []
      }
      agenda_funcionario: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          funcionario_id: string
          id: string
          local: string | null
          observacoes: string | null
          participantes: string[] | null
          prioridade: string
          status: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          descricao?: string | null
          funcionario_id: string
          id?: string
          local?: string | null
          observacoes?: string | null
          participantes?: string[] | null
          prioridade?: string
          status?: string
          tipo?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          funcionario_id?: string
          id?: string
          local?: string | null
          observacoes?: string | null
          participantes?: string[] | null
          prioridade?: string
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agenda_funcionario_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
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
      analise_sentimento: {
        Row: {
          confianca: number
          created_at: string
          data_publicacao: string | null
          fonte: string
          id: string
          mencoes_encontradas: string[] | null
          palavras_chave: string[] | null
          processed_at: string
          score_sentimento: number
          sentimento: string
          texto_analisado: string
          url_origem: string | null
          user_id: string
        }
        Insert: {
          confianca: number
          created_at?: string
          data_publicacao?: string | null
          fonte: string
          id?: string
          mencoes_encontradas?: string[] | null
          palavras_chave?: string[] | null
          processed_at?: string
          score_sentimento: number
          sentimento: string
          texto_analisado: string
          url_origem?: string | null
          user_id: string
        }
        Update: {
          confianca?: number
          created_at?: string
          data_publicacao?: string | null
          fonte?: string
          id?: string
          mencoes_encontradas?: string[] | null
          palavras_chave?: string[] | null
          processed_at?: string
          score_sentimento?: number
          sentimento?: string
          texto_analisado?: string
          url_origem?: string | null
          user_id?: string
        }
        Relationships: []
      }
      arquivo_digital: {
        Row: {
          arquivo_nome: string | null
          arquivo_tamanho: number | null
          arquivo_url: string | null
          categoria: string | null
          created_at: string
          data_documento: string | null
          descricao: string | null
          destino: string | null
          id: string
          numero_protocolo: string | null
          origem: string | null
          status: string
          tags: string[] | null
          tipo_documento: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_tamanho?: number | null
          arquivo_url?: string | null
          categoria?: string | null
          created_at?: string
          data_documento?: string | null
          descricao?: string | null
          destino?: string | null
          id?: string
          numero_protocolo?: string | null
          origem?: string | null
          status?: string
          tags?: string[] | null
          tipo_documento: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_tamanho?: number | null
          arquivo_url?: string | null
          categoria?: string | null
          created_at?: string
          data_documento?: string | null
          descricao?: string | null
          destino?: string | null
          id?: string
          numero_protocolo?: string | null
          origem?: string | null
          status?: string
          tags?: string[] | null
          tipo_documento?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      avaliacoes_desempenho: {
        Row: {
          avaliador_id: string | null
          comentarios_avaliador: string | null
          comentarios_funcionario: string | null
          created_at: string
          funcionario_id: string
          id: string
          nota_geral: number | null
          objetivos_proximos: string | null
          periodo_fim: string
          periodo_inicio: string
          pontos_fortes: string | null
          pontos_melhoria: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avaliador_id?: string | null
          comentarios_avaliador?: string | null
          comentarios_funcionario?: string | null
          created_at?: string
          funcionario_id: string
          id?: string
          nota_geral?: number | null
          objetivos_proximos?: string | null
          periodo_fim: string
          periodo_inicio: string
          pontos_fortes?: string | null
          pontos_melhoria?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avaliador_id?: string | null
          comentarios_avaliador?: string | null
          comentarios_funcionario?: string | null
          created_at?: string
          funcionario_id?: string
          id?: string
          nota_geral?: number | null
          objetivos_proximos?: string | null
          periodo_fim?: string
          periodo_inicio?: string
          pontos_fortes?: string | null
          pontos_melhoria?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_desempenho_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_desempenho_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
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
      consultas_publicas: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          descricao: string
          documentos: Json | null
          id: string
          link_participacao: string | null
          local_realizacao: string | null
          modalidade: string
          publico_alvo: string | null
          resultados: Json | null
          status: string
          tema: string | null
          tipo_consulta: string
          titulo: string
          total_participantes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio: string
          descricao: string
          documentos?: Json | null
          id?: string
          link_participacao?: string | null
          local_realizacao?: string | null
          modalidade?: string
          publico_alvo?: string | null
          resultados?: Json | null
          status?: string
          tema?: string | null
          tipo_consulta: string
          titulo: string
          total_participantes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string
          documentos?: Json | null
          id?: string
          link_participacao?: string | null
          local_realizacao?: string | null
          modalidade?: string
          publico_alvo?: string | null
          resultados?: Json | null
          status?: string
          tema?: string | null
          tipo_consulta?: string
          titulo?: string
          total_participantes?: number | null
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
      criterios_avaliacao: {
        Row: {
          avaliacao_id: string
          created_at: string
          criterio: string
          id: string
          nota: number | null
          observacoes: string | null
          peso: number | null
        }
        Insert: {
          avaliacao_id: string
          created_at?: string
          criterio: string
          id?: string
          nota?: number | null
          observacoes?: string | null
          peso?: number | null
        }
        Update: {
          avaliacao_id?: string
          created_at?: string
          criterio?: string
          id?: string
          nota?: number | null
          observacoes?: string | null
          peso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "criterios_avaliacao_avaliacao_id_fkey"
            columns: ["avaliacao_id"]
            isOneToOne: false
            referencedRelation: "avaliacoes_desempenho"
            referencedColumns: ["id"]
          },
        ]
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
      folha_pagamento: {
        Row: {
          adicional_noturno: number | null
          created_at: string
          funcionario_id: string
          horas_extras: number | null
          horas_trabalhadas: number | null
          id: string
          inss: number | null
          ir: number | null
          mes_referencia: string
          observacoes: string | null
          outros_beneficios: number | null
          outros_descontos: number | null
          plano_saude: number | null
          salario_base: number
          salario_liquido: number | null
          status: string
          updated_at: string
          user_id: string
          vale_alimentacao: number | null
          vale_transporte: number | null
          valor_hora_extra: number | null
        }
        Insert: {
          adicional_noturno?: number | null
          created_at?: string
          funcionario_id: string
          horas_extras?: number | null
          horas_trabalhadas?: number | null
          id?: string
          inss?: number | null
          ir?: number | null
          mes_referencia: string
          observacoes?: string | null
          outros_beneficios?: number | null
          outros_descontos?: number | null
          plano_saude?: number | null
          salario_base: number
          salario_liquido?: number | null
          status?: string
          updated_at?: string
          user_id: string
          vale_alimentacao?: number | null
          vale_transporte?: number | null
          valor_hora_extra?: number | null
        }
        Update: {
          adicional_noturno?: number | null
          created_at?: string
          funcionario_id?: string
          horas_extras?: number | null
          horas_trabalhadas?: number | null
          id?: string
          inss?: number | null
          ir?: number | null
          mes_referencia?: string
          observacoes?: string | null
          outros_beneficios?: number | null
          outros_descontos?: number | null
          plano_saude?: number | null
          salario_base?: number
          salario_liquido?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          vale_alimentacao?: number | null
          vale_transporte?: number | null
          valor_hora_extra?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "folha_pagamento_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
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
      funcionarios: {
        Row: {
          carga_horaria: number
          cargo: string
          created_at: string
          data_admissao: string
          data_demissao: string | null
          email: string | null
          id: string
          nome: string
          observacoes: string | null
          salario: number | null
          status: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          carga_horaria?: number
          cargo: string
          created_at?: string
          data_admissao: string
          data_demissao?: string | null
          email?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          carga_horaria?: number
          cargo?: string
          created_at?: string
          data_admissao?: string
          data_demissao?: string | null
          email?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          salario?: number | null
          status?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      historico_kpis: {
        Row: {
          created_at: string
          data_coleta: string
          id: string
          kpi_id: string
          valor: number
          valor_anterior: number | null
          variacao_absoluta: number | null
          variacao_percentual: number | null
        }
        Insert: {
          created_at?: string
          data_coleta: string
          id?: string
          kpi_id: string
          valor: number
          valor_anterior?: number | null
          variacao_absoluta?: number | null
          variacao_percentual?: number | null
        }
        Update: {
          created_at?: string
          data_coleta?: string
          id?: string
          kpi_id?: string
          valor?: number
          valor_anterior?: number | null
          variacao_absoluta?: number | null
          variacao_percentual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_kpis_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis_personalizados"
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
      kpis_personalizados: {
        Row: {
          ativo: boolean | null
          configuracao: Json
          cor_display: string | null
          created_at: string
          descricao: string | null
          fonte_dados: string
          id: string
          meta_valor: number | null
          nome: string
          ordem_exibicao: number | null
          tipo_metrica: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          configuracao?: Json
          cor_display?: string | null
          created_at?: string
          descricao?: string | null
          fonte_dados: string
          id?: string
          meta_valor?: number | null
          nome: string
          ordem_exibicao?: number | null
          tipo_metrica: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          configuracao?: Json
          cor_display?: string | null
          created_at?: string
          descricao?: string | null
          fonte_dados?: string
          id?: string
          meta_valor?: number | null
          nome?: string
          ordem_exibicao?: number | null
          tipo_metrica?: string
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
      monitoramento_legislativo: {
        Row: {
          alertas_configurados: Json | null
          autor: string | null
          casa_legislativa: string
          created_at: string
          data_apresentacao: string | null
          ementa: string | null
          id: string
          impacto_estimado: string | null
          link_projeto: string | null
          numero_projeto: string
          observacoes: string | null
          situacao_atual: string | null
          status_monitoramento: string
          tema_relacionado: string | null
          tipo_projeto: string
          titulo: string
          tramitacao_atual: string | null
          updated_at: string
          urgencia: string | null
          user_id: string
        }
        Insert: {
          alertas_configurados?: Json | null
          autor?: string | null
          casa_legislativa: string
          created_at?: string
          data_apresentacao?: string | null
          ementa?: string | null
          id?: string
          impacto_estimado?: string | null
          link_projeto?: string | null
          numero_projeto: string
          observacoes?: string | null
          situacao_atual?: string | null
          status_monitoramento?: string
          tema_relacionado?: string | null
          tipo_projeto: string
          titulo: string
          tramitacao_atual?: string | null
          updated_at?: string
          urgencia?: string | null
          user_id: string
        }
        Update: {
          alertas_configurados?: Json | null
          autor?: string | null
          casa_legislativa?: string
          created_at?: string
          data_apresentacao?: string | null
          ementa?: string | null
          id?: string
          impacto_estimado?: string | null
          link_projeto?: string | null
          numero_projeto?: string
          observacoes?: string | null
          situacao_atual?: string | null
          status_monitoramento?: string
          tema_relacionado?: string | null
          tipo_projeto?: string
          titulo?: string
          tramitacao_atual?: string | null
          updated_at?: string
          urgencia?: string | null
          user_id?: string
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
      orcamento_publico: {
        Row: {
          created_at: string
          data_aprovacao: string | null
          data_limite: string | null
          descricao: string
          destino: string | null
          documentos: Json | null
          id: string
          numero_emenda: string | null
          observacoes: string | null
          origem: string | null
          status: string | null
          tipo: string
          updated_at: string
          user_id: string | null
          valor_executado: number | null
          valor_pendente: number | null
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_aprovacao?: string | null
          data_limite?: string | null
          descricao: string
          destino?: string | null
          documentos?: Json | null
          id?: string
          numero_emenda?: string | null
          observacoes?: string | null
          origem?: string | null
          status?: string | null
          tipo: string
          updated_at?: string
          user_id?: string | null
          valor_executado?: number | null
          valor_pendente?: number | null
          valor_total: number
        }
        Update: {
          created_at?: string
          data_aprovacao?: string | null
          data_limite?: string | null
          descricao?: string
          destino?: string | null
          documentos?: Json | null
          id?: string
          numero_emenda?: string | null
          observacoes?: string | null
          origem?: string | null
          status?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string | null
          valor_executado?: number | null
          valor_pendente?: number | null
          valor_total?: number
        }
        Relationships: []
      }
      participacoes_consulta: {
        Row: {
          aprovado: boolean | null
          consulta_id: string | null
          contribuicao: string | null
          data_participacao: string
          email: string | null
          id: string
          nome_participante: string
          telefone: string | null
        }
        Insert: {
          aprovado?: boolean | null
          consulta_id?: string | null
          contribuicao?: string | null
          data_participacao?: string
          email?: string | null
          id?: string
          nome_participante: string
          telefone?: string | null
        }
        Update: {
          aprovado?: boolean | null
          consulta_id?: string | null
          contribuicao?: string | null
          data_participacao?: string
          email?: string | null
          id?: string
          nome_participante?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participacoes_consulta_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas_publicas"
            referencedColumns: ["id"]
          },
        ]
      }
      ponto_eletronico: {
        Row: {
          created_at: string
          data_hora: string
          funcionario_id: string
          id: string
          observacoes: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_hora: string
          funcionario_id: string
          id?: string
          observacoes?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_hora?: string
          funcionario_id?: string
          id?: string
          observacoes?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ponto_eletronico_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      prestacao_contas: {
        Row: {
          categoria: string
          centro_custo: string | null
          comprovantes: Json | null
          created_at: string
          data_pagamento: string | null
          descricao: string
          fornecedor: string | null
          id: string
          numero_nota_fiscal: string | null
          observacoes: string | null
          periodo_fim: string
          periodo_inicio: string
          projeto_relacionado: string | null
          status: string | null
          subcategoria: string | null
          updated_at: string
          user_id: string | null
          valor: number
        }
        Insert: {
          categoria: string
          centro_custo?: string | null
          comprovantes?: Json | null
          created_at?: string
          data_pagamento?: string | null
          descricao: string
          fornecedor?: string | null
          id?: string
          numero_nota_fiscal?: string | null
          observacoes?: string | null
          periodo_fim: string
          periodo_inicio: string
          projeto_relacionado?: string | null
          status?: string | null
          subcategoria?: string | null
          updated_at?: string
          user_id?: string | null
          valor: number
        }
        Update: {
          categoria?: string
          centro_custo?: string | null
          comprovantes?: Json | null
          created_at?: string
          data_pagamento?: string | null
          descricao?: string
          fornecedor?: string | null
          id?: string
          numero_nota_fiscal?: string | null
          observacoes?: string | null
          periodo_fim?: string
          periodo_inicio?: string
          projeto_relacionado?: string | null
          status?: string | null
          subcategoria?: string | null
          updated_at?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      previsoes_ia: {
        Row: {
          confianca_previsao: number
          created_at: string
          dados_entrada: Json
          erro_detalhes: string | null
          id: string
          metodologia: string
          periodo_analise: string
          previsao_resultado: Json
          status: string
          tipo_previsao: string
          updated_at: string
          user_id: string
          valida_ate: string | null
        }
        Insert: {
          confianca_previsao: number
          created_at?: string
          dados_entrada: Json
          erro_detalhes?: string | null
          id?: string
          metodologia: string
          periodo_analise: string
          previsao_resultado: Json
          status?: string
          tipo_previsao: string
          updated_at?: string
          user_id: string
          valida_ate?: string | null
        }
        Update: {
          confianca_previsao?: number
          created_at?: string
          dados_entrada?: Json
          erro_detalhes?: string | null
          id?: string
          metodologia?: string
          periodo_analise?: string
          previsao_resultado?: Json
          status?: string
          tipo_previsao?: string
          updated_at?: string
          user_id?: string
          valida_ate?: string | null
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
      projetos_impacto_financeiro: {
        Row: {
          beneficiarios_estimados: number | null
          categoria: string | null
          created_at: string
          custo_estimado: number
          custo_real: number | null
          data_fim_prevista: string | null
          data_fim_real: string | null
          data_inicio_prevista: string | null
          data_inicio_real: string | null
          descricao: string
          documentos: Json | null
          fonte_recurso: string | null
          id: string
          impacto_social: string | null
          marcos: Json | null
          nome_projeto: string
          prioridade: string | null
          retorno_estimado: string | null
          riscos_identificados: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          beneficiarios_estimados?: number | null
          categoria?: string | null
          created_at?: string
          custo_estimado: number
          custo_real?: number | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio_prevista?: string | null
          data_inicio_real?: string | null
          descricao: string
          documentos?: Json | null
          fonte_recurso?: string | null
          id?: string
          impacto_social?: string | null
          marcos?: Json | null
          nome_projeto: string
          prioridade?: string | null
          retorno_estimado?: string | null
          riscos_identificados?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          beneficiarios_estimados?: number | null
          categoria?: string | null
          created_at?: string
          custo_estimado?: number
          custo_real?: number | null
          data_fim_prevista?: string | null
          data_fim_real?: string | null
          data_inicio_prevista?: string | null
          data_inicio_real?: string | null
          descricao?: string
          documentos?: Json | null
          fonte_recurso?: string | null
          id?: string
          impacto_social?: string | null
          marcos?: Json | null
          nome_projeto?: string
          prioridade?: string | null
          retorno_estimado?: string | null
          riscos_identificados?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      relacionamento_institucional: {
        Row: {
          area_atuacao: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nivel_relacionamento: string
          nome_instituicao: string
          observacoes: string | null
          proximo_contato: string | null
          responsavel_cargo: string | null
          responsavel_nome: string | null
          status: string
          telefone: string | null
          tipo_instituicao: string
          ultima_interacao: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          area_atuacao?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nivel_relacionamento?: string
          nome_instituicao: string
          observacoes?: string | null
          proximo_contato?: string | null
          responsavel_cargo?: string | null
          responsavel_nome?: string | null
          status?: string
          telefone?: string | null
          tipo_instituicao: string
          ultima_interacao?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          area_atuacao?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nivel_relacionamento?: string
          nome_instituicao?: string
          observacoes?: string | null
          proximo_contato?: string | null
          responsavel_cargo?: string | null
          responsavel_nome?: string | null
          status?: string
          telefone?: string | null
          tipo_instituicao?: string
          ultima_interacao?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      relatorios_automatizados: {
        Row: {
          ativo: boolean | null
          configuracao: Json
          created_at: string
          destinatarios: string[] | null
          formato: string
          frequencia: string
          id: string
          nome: string
          proxima_execucao: string | null
          tipo_relatorio: string
          ultima_execucao: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          configuracao?: Json
          created_at?: string
          destinatarios?: string[] | null
          formato?: string
          frequencia: string
          id?: string
          nome: string
          proxima_execucao?: string | null
          tipo_relatorio: string
          ultima_execucao?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          configuracao?: Json
          created_at?: string
          destinatarios?: string[] | null
          formato?: string
          frequencia?: string
          id?: string
          nome?: string
          proxima_execucao?: string | null
          tipo_relatorio?: string
          ultima_execucao?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tarefas_equipe: {
        Row: {
          created_at: string
          data_conclusao: string | null
          data_inicio: string
          data_limite: string | null
          descricao: string | null
          funcionario_id: string
          id: string
          observacoes: string | null
          prioridade: string
          status: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_conclusao?: string | null
          data_inicio: string
          data_limite?: string | null
          descricao?: string | null
          funcionario_id: string
          id?: string
          observacoes?: string | null
          prioridade?: string
          status?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          data_limite?: string | null
          descricao?: string | null
          funcionario_id?: string
          id?: string
          observacoes?: string | null
          prioridade?: string
          status?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_equipe_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tramitacao_legislativa: {
        Row: {
          created_at: string
          data_tramitacao: string
          despacho: string | null
          id: string
          observacoes: string | null
          orgao: string
          projeto_id: string | null
          situacao: string
        }
        Insert: {
          created_at?: string
          data_tramitacao: string
          despacho?: string | null
          id?: string
          observacoes?: string | null
          orgao: string
          projeto_id?: string | null
          situacao: string
        }
        Update: {
          created_at?: string
          data_tramitacao?: string
          despacho?: string | null
          id?: string
          observacoes?: string | null
          orgao?: string
          projeto_id?: string | null
          situacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "tramitacao_legislativa_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "monitoramento_legislativo"
            referencedColumns: ["id"]
          },
        ]
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
      admin_create_user: {
        Args: {
          user_email: string
          user_password: string
          user_name: string
          user_roles?: string[]
        }
        Returns: Json
      }
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
