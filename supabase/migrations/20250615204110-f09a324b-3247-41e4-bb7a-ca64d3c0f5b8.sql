
-- Criar tabela para consentimentos de usuário
CREATE TABLE public.user_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT false,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  purpose TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para log de processamento de dados
CREATE TABLE public.data_processing_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  data_processed TEXT[] NOT NULL DEFAULT '{}',
  purpose TEXT NOT NULL,
  legal_basis TEXT NOT NULL,
  retention_period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar RLS (Row Level Security) para user_consents
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consents" 
  ON public.user_consents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents" 
  ON public.user_consents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents" 
  ON public.user_consents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own consents" 
  ON public.user_consents 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Adicionar RLS para data_processing_log
ALTER TABLE public.data_processing_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own processing logs" 
  ON public.data_processing_log 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processing logs" 
  ON public.data_processing_log 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_type ON public.user_consents(consent_type);
CREATE INDEX idx_user_consents_granted ON public.user_consents(granted);
CREATE INDEX idx_data_processing_log_user_id ON public.data_processing_log(user_id);
CREATE INDEX idx_data_processing_log_activity ON public.data_processing_log(activity_type);

-- Função para notificar expiração de consentimentos (30 dias)
CREATE OR REPLACE FUNCTION notify_consent_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Inserir notificações para consentimentos que expiram em 7 dias
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    uc.user_id,
    'Consentimento Expirando',
    'Seu consentimento para ' || uc.consent_type || ' expira em breve. Renovar?',
    'warning'
  FROM public.user_consents uc
  WHERE uc.granted = true 
    AND uc.revoked_at IS NULL
    AND uc.granted_at < (now() - interval '23 days') -- 30 dias - 7 dias de aviso
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n 
      WHERE n.user_id = uc.user_id 
        AND n.message LIKE '%' || uc.consent_type || '%'
        AND n.created_at > (now() - interval '7 days')
    );
END;
$$;
