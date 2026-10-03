# @rafadepaula/clickup-mcp

Servidor **Model Context Protocol (MCP)** completo para o ClickUp em Node.js / TypeScript com suporte a **todas as 61 ferramentas oficiais**, utilizando conexão direta à API REST do ClickUp com limites de requisição altos.

[![npm version](https://img.shields.io/npm/v/@rafadepaula/clickup-mcp.svg)](https://www.npmjs.com/package/@rafadepaula/clickup-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-rafadepaula%2Fclickup--mcp-black)](https://github.com/rafadepaula/clickup-mcp)

---

## ⚡ Por que este MCP?

O servidor MCP oficial hospedado pela ClickUp (`https://mcp.clickup.com/mcp`) impõe um limite muito baixo de apenas **100 chamadas diárias** no plano gratuito:
> `⚡ Daily MCP limit reached (100/100 calls used). Try again in 14h.`

Este servidor conecta-se **diretamente à API REST oficial do ClickUp** (v2 e v3) usando seu Personal API Token (`pk_...`), oferecendo o limite padrão da API pública de **100+ requisições por minuto** (mais de 140.000 requisições por dia!).

---

## 🚀 Como Usar com `npx`

Você pode executar o servidor diretamente via `npx` em um único comando:

```bash
# Execução direta via npm:
npx @rafadepaula/clickup-mcp

# Ou diretamente via GitHub:
npx rafadepaula/clickup-mcp
```

### Configuração no seu cliente MCP (Claude Desktop, Cursor, Antigravity, etc.)

Adicione ao seu arquivo de configuração MCP (`claude_desktop_config.json`, `mcp_config.json`, etc.):

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": [
        "-y",
        "@rafadepaula/clickup-mcp"
      ],
      "env": {
        "CLICKUP_API_TOKEN": "pk_seu_token_aqui"
      }
    }
  }
}
```

> **Configuração mínima de 1 variável**: Basta fornecer `CLICKUP_API_TOKEN`! O servidor descobre automaticamente seu Workspace (`team_id`), membros e tipos de tarefas.

---

## 🛠️ Catálogo Completo das 61 Ferramentas

O servidor implementa exatamente as mesmas 61 tools do MCP do ClickUp:

### 1. Gestão de Tarefas (Tasks)
* `clickup_create_task` - Cria tarefas completas (suporte a Markdown, prioridade, prazos, estimativas, campos customizados e subtarefas).
* `clickup_get_task` - Retorna detalhes da tarefa e subtarefas.
* `clickup_update_task` - Atualiza propriedades, status, responsáveis, prioridade e campos customizados.
* `clickup_delete_task` - Remove uma tarefa.
* `clickup_filter_tasks` - Filtra tarefas por lista, espaço, pasta, tags, status, datas e responsáveis.
* `clickup_search` - Busca inteligente por palavras-chave em tarefas e conteúdos do workspace.
* `clickup_move_task` - Move tarefa para uma nova lista principal.
* `clickup_merge_tasks` - Mescla tarefas de origem em uma tarefa de destino.

### 2. Relacionamentos, Tags e Dependências
* `clickup_add_tag_to_task` / `clickup_remove_tag_from_task` - Adiciona e remove tags da tarefa.
* `clickup_add_task_dependency` / `clickup_remove_task_dependency` - Gerencia dependências (`waiting_on` e `blocking`).
* `clickup_add_task_link` / `clickup_remove_task_link` - Cria e remove links entre tarefas.
* `clickup_add_task_to_list` / `clickup_remove_task_from_list` - Adiciona e remove tarefas de listas secundárias.

### 3. Listas e Pastas (Lists & Folders)
* `clickup_create_folder` / `clickup_get_folder` / `clickup_update_folder` - Gerenciamento de pastas.
* `clickup_create_list` / `clickup_create_list_in_folder` / `clickup_get_list` / `clickup_update_list` - Gerenciamento de listas.

### 4. Hierarquia e Membros
* `clickup_get_workspace_hierarchy` - Visualiza árvore completa de espaços, pastas e listas.
* `clickup_get_workspace_members` - Lista membros do workspace.
* `clickup_find_member_by_name` - Localiza membro por nome ou e-mail.
* `clickup_resolve_assignees` - Converte nomes, e-mails ou `"me"` em IDs numéricos de usuário.
* `clickup_get_custom_fields` - Consulta campos customizados por lista, pasta, espaço ou workspace.

### 5. Comentários (Comments)
* `clickup_create_task_comment` - Adiciona comentário a uma tarefa.
* `clickup_get_task_comments` - Lista comentários da tarefa.
* `clickup_create_comment` - Cria comentário em tarefa, lista ou view.
* `clickup_update_comment` - Edita texto ou resolve comentário.
* `clickup_delete_comment` - Exclui comentário.
* `clickup_get_threaded_comments` - Retorna respostas aninhadas (threads).

### 6. Anexos e Arquivos (Attachments)
* `clickup_attach_task_file` - Anexa arquivo à tarefa via Base64 ou URL da web.
* `clickup_request_attachment_upload` - Gera parâmetros para upload multipart de arquivos locais.
* `clickup_download_task_attachment` - Obtém metadados e URL de download de anexo.
* `clickup_list_document_page_attachments` / `clickup_download_document_page_attachment`

### 7. Documentos (Docs v3)
* `clickup_create_document` - Cria documento no espaço, pasta ou lista.
* `clickup_list_document_pages` - Lista estrutura de páginas do documento.
* `clickup_get_document_pages` - Obtém conteúdo em Markdown das páginas.
* `clickup_create_document_page` - Cria nova página no documento.
* `clickup_update_document_page` - Atualiza título e conteúdo da página (`replace`, `append`, `prepend`).

### 8. Chat
* `clickup_get_chat_channels` - Lista canais de chat do workspace.
* `clickup_send_chat_message` - Envia mensagem ou resposta para um canal.
* `clickup_get_chat_channel_messages` - Obtém mensagens do canal.
* `clickup_get_chat_message_replies` - Obtém respostas aninhadas de uma mensagem.

### 9. Lembretes (Reminders)
* `clickup_create_reminder` - Cria lembrete pessoal com data/hora.
* `clickup_search_reminders` - Busca lembretes.
* `clickup_update_reminder` - Atualiza ou conclui lembrete.

### 10. Controle de Tempo (Time Tracking)
* `clickup_start_time_tracking` - Inicia cronômetro em uma tarefa.
* `clickup_stop_time_tracking` - Para o cronômetro ativo.
* `clickup_add_time_entry` - Registra entrada manual de tempo.
* `clickup_get_current_time_entry` - Consulta cronômetro em execução.
* `clickup_get_time_entries` - Consulta histórico de tempo registrado.
* `clickup_get_task_time_in_status` / `clickup_get_bulk_tasks_time_in_status` - Tempo por status.

### 11. Compatibilidade Geral
* `clickup_get_operators`
* `clickup_execute_operator`
* `clickup_get_schema`

---

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Executar bateria completa de testes de integração contra a API
npm test

# Testar via protocolo padrão MCP stdio
npx tsx src/test/test-mcp-protocol.ts
```

---

## 📄 Licença

MIT © [Rafael de Paula](https://github.com/rafadepaula)
