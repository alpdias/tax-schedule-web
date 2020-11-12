/*
Criado em 09/2020
@Autor: Paulo https://github.com/alpdias
*/

let data = new Date; // variavel com a data
let atual = (data.getMonth() + 1); // variavel com o mes atual
let anterior = ((data.getMonth() - 1) + 1); // variavel com o mes anterior
let proximo = ((data.getMonth() + 1) + 1); // variavel com o proximo mes

const mesNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; // lista com os nomes dos meses

let atualNome = mesNome[(atual - 1)]; // variavel com o nome do mes atual
let anteriorNome = mesNome[(anterior - 1)]; // variavel com o nome do mes anterior
let proximoNome = mesNome[(proximo - 1)]; // variavel com o nome do proximo mes

function preLoad() {

    if (document.querySelector('#carregando-fora') === null) {

    } else {

        document.querySelector('#carregando-fora').innerHTML = `\
            <div id="carregamento-dentro">\
                <div id="carregamento-interno">\
                    <p><i class="fa fa-cog fa-spin fa-5x fa-fw"></i></p>\
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;carregando...</p>\
                </div>\
            </div>`;

    };

};

function carregamento() {

    document.querySelector('#carregando-fora').style.display = 'block';

};

function entrada() { // funçao para inserior o HTML de entrada

    if (document.querySelector('#formulario-entrada') === null) {

    } else {

        document.querySelector('#formulario-entrada').innerHTML = `\
            <p>Gere um arquivo de texto com a agenda tributária da receita federal no modelo csv para download ou um arquivo para integrar no calendário do Microsoft Outlook</p>
            <label for="opcoes">Mês referência &#128198;</label>\
            <div id="opcoes">\
                <select name="mes-referencia" id="mes-referencia" class="selecoes" onclick="verificarURL()">\
                    <option value="${atual}">${atualNome}</option>\
                    <option value="${anterior}">${anteriorNome}</option>\
                    <option value="${proximo}">${proximoNome}</option>\
                </select>\</br>
            </div>\
            <label for="empresas">Ramo empresarial &#128188;</label>\
            <div id="empresas">\
                <select name="tipo-empresa" id="tipo-empresa" class="selecoes">\
                    <option value="CC">Completo</option>\
                    <option value="S">Serviço</option>\
                    <option value="C">Comércio</option>\
                    <option value="I">Indústria</option>\
                    <option value="F">Financeiro</option>\
                </select>\
            </div>\ 
            <label for="tipos">Tipo &#128190;</label>\
            <div id="tipos">\
                <input type="radio" name="tipo" id="ponto-virgula" value="ponto-virgula" checked><label for="ponto-virgula">&nbsp;CSV</label>&nbsp;&nbsp;\
                <input type="radio" name="tipo" id="virgula" value="virgula"><label for="virgula">&nbsp;Outlook</label>\
            </div>
            <div>\
                <button type="submit" id="enviar-entrada" onclick="carregamento()">GERAR &#128195;</button>\  
            </div>`;

    };

};

function verificarErro() { // funcao para verificar a entrada de erro no back-end

    if (document.querySelector('#var-erro') === null) {  

    } else {

        let tipoErro = document.querySelector('#var-erro').textContent;

        if (tipoErro === 404) {

        document.querySelector('#resultado').style.color = 'red';

        } else {};

    };

};

function verificarURL() { // funcao para retornar a url certa

    let ano = data.getFullYear();
    let selecaoMes = document.querySelector('#mes-referencia');
    let selecionado = selecaoMes.options[selecaoMes.selectedIndex].value;
    
    document.querySelector('#verificar-link').innerHTML = `https://www.gov.br/receitafederal/pt-br/assuntos/agenda-tributaria/agenda-tributaria-${ano}/${(mesNome[(selecionado -1)]).toLowerCase()}-${ano}/agenda-tributaria-${(mesNome[(selecionado -1)]).toLowerCase()}-${ano}`;

};

function baixar() { // funcao para baixar o documento

    let tipoSelecionado = document.querySelector('#var-escondido').textContent;
    let tipoDoc = '';

    if (tipoSelecionado === 'ponto-virgula') {

        tipoDoc = '.txt';

    } else {

        tipoDoc = '.csv';

    };

    let textoArea = document.querySelector('#resultado').value;
    let titulo = 'agenda';

    let blob = new Blob([textoArea],
        {
            type: 'text/plain;charset=utf-8' 
        });

    saveAs(blob, titulo + `${tipoDoc}`);

    tipoDoc = '';

};

function observacao() {
    
    if (document.querySelector('#observacao') === null) {

    } else {

        document.querySelector('#observacao').innerHTML = `\
            <p><strong>Nota:</strong> O intuito desse projeto é totalmente para estudos e aprendizagem, abdicando-se de qualquer responsabilidade quanto ao uso dos dados gerados, a fonte utilizada para a obter os dados é o site (http://receita.economia.gov.br/acesso-rapido/agenda-tributaria) que não tem nenhuma ligação com esse projeto.</p>`;

    };

};

function tutorial() { // funçao para inserior o HTML de tutorial

    if (document.querySelector('#tutorial') === null) {

    } else {

        document.querySelector('#tutorial').innerHTML = `\
            <div>\
                <h1>Como integrar ao calendário do Microsoft Outlook!?</h1>\
                <p>Abaixo você vai encontrar um breve tutorial de como integrar a agenda tributária da receita federal no calendário do Microsoft Outlook, de uma maneira rápida e fácil, podendo ter na sua máquina todas as datas de pagamento dos tributos/contribuições e evitar perder prazos. Lembrando que todos os eventos vem com lembretes definidos para três dias antes, e você pode escolher entre o arquivo completo e tratar ele fazendo um filtro antes de integrar ou os arquivos resumidos por ramo de atividade que já vem com os princpais tributos/contribuições por atividade.</p>\
                <h2>Tratando o arquivo de texto</h2>\
                <p>Antes de integrar o arquivo com o calendário temos que fazer alguns ajustes (válido para os arquivos .csv) devido as configuração padrão dos aplicativos da Microsoft, e evitar alguns erros de português que podem tornar alguns textos ilegíveis.</p>\
                <p>Com o arquivo <strong>'agenda.csv'</strong> baixado abra o arquivo com o bloco de notas, no menu <strong>Arquivo</strong> selecione a opção <strong>Salvar como...</strong> e em seguida de um nome para o seu arquivo e coloque a extensão <strong>.csv</strong> ainda na mesma tela na parte inferior direita em <strong>Codificação</strong> selecione a opção <strong>UTF-8 com BOM</strong> e pronto, é só salvar o arquivo.</p>\
                <h2>Integrando o calendário</h2>\
                <p>Depois que o arquivo foi tratado vamos integrar ao calendário com alguns passos simples.</p>\           
                <h3>&nbsp;&nbsp;Passo 01:</h3>\
                <p>Com o arquivo pronto, abra o aplicativo Microsoft Outlook e vá para o calendário clicando no ícone no canto inferior esquerdo. </p>
                <img src="../../static/img/tutorial/passo-01.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 02:</h3>\
                <p>Ainda no canto inferior esquerdo do aplicativo, clique com o botão direito do mouse sobre o <strong>Calendário</strong> e selecione a opção <strong>Novo Calendário...</strong></p>\
                <img src="../../static/img/tutorial/passo-02.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 03:</h3>\
                <p>De um nome para o seu novo calendário, no exemplo será usado o nome de <strong>Agenda Tributária</strong>.</p>\
                <img src="../../static/img/tutorial/passo-03.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 04:</h3>\
                <p>Você verá o seu novo calendário no canto inferior esquerdo do aplicativo, junto com os demais que tiver, selecione apenas o novo calendário criado.</p>\
                <img src="../../static/img/tutorial/passo-04.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 05:</h3>\
                <p>Vá para o canto superior esquerdo do aplicativo em <strong>Arquivo</strong>.</p>\
                <img src="../../static/img/tutorial/passo-05.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 06:</h3>\
                <p>Entre no menu lateral <strong>Abrir e Exportar</strong> e depois a opção <strong>Importar/Exportar</strong>.</p>\
                <img src="../../static/img/tutorial/passo-06.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 07:</h3>\
                <p>Com o 'Assistente para importação e exportação' aberto escolha a ação <strong>Importar de outro programa ou arquivo</strong>.</p>\
                <img src="../../static/img/tutorial/passo-07.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 08:</h3>\
                <p>Selecione o tipo de arquivo <strong>Valores Separados por Vírgula</strong>.</p>\
                <img src="../../static/img/tutorial/passo-08.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 09:</h3>\
                <p>Selecione o arquivo de importação que você fez download e depois tratou.</p>\
                <img src="../../static/img/tutorial/passo-09.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 10:</h3>\
                <p>Selecione o calendário que você criou, no caso do exemplo <strong>Agenda Tributária</strong>.</p>\
                <img src="../../static/img/tutorial/passo-10.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <p id="observacao-vermelho">Caso ocorra o erro abaixo ao executar o passo 10, abra um arquivo de excel em branco e cole os dados do arquivo tratado lá dentro, e salve com a extensão <strong>.csv</strong> isso provavelmente ocorre por que a máquina é bloqueada para alguns acessos.</p>\
                <img src="../../static/img/tutorial/passo-erro.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 11:</h3>\
                <p>Selecione a importação do arquivo carregado e clique em <strong>Mapear campos personalizados...</strong></p>\
                <img src="../../static/img/tutorial/passo-11.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 12:</h3>\
                <p>Nesse passo vamos mapear os campos do arquivo pelo titulo do cabeçalho, arraste os valores para os nomes correspondentes, assim como na imagem.</p>\
                <img src="../../static/img/tutorial/passo-12.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <h3>&nbsp;&nbsp;Passo 13:</h3>\
                <p>Agora é só esperar carregar a importação.</p>\
                <img src="../../static/img/tutorial/passo-13.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <span class="tabulacao"></span>\
                <p>Pronto a <strong>Agenda Tributária</strong> da receita federal está integrada ao seu calendário no Microsoft Outlook.</p>\
                <img src="../../static/img/tutorial/passo-14.jpg" alt="agenda tributaria da receita federal integraçao com o calendario do microsoft outlook" class="img-tutorial">\
                <span class="tabulacao"></span>\
            </div>`;

    };

};

function tagSite() { // funçao para inserir as TAG's no HTML

    if (document.querySelector('#tags-site') === null) {

    } else {

        document.querySelector('#tags-site').innerHTML = `\
            <div>#agenda #calendario #tributaria #receitafederal #agendatributaria #darf #microsoftoutlook</div>`;

    };

};

function termosNavegacao() {

    if (document.querySelector('#termos-navegacao') === null) {

    } else {

        document.querySelector('#termos-navegacao').innerHTML = `\
            <p>Utilizamos cookies e tecnologias semelhantes de acordo com a nossa <a href="privacidade" target="_blank">Política de Privacidade</a> e <a href="termos" target="_blank">Termos de Uso</a>, ao continuar navegando você concorda com essas condições. &nbsp;&nbsp;&nbsp;&nbsp;<button id="fechar-cookies">OK</button></p>`;

    };

};

function privacidade() {

    if (document.querySelector('#politicas') === null) {

    } else {

        document.querySelector('#politicas').innerHTML = `\
            <article>\
                <p>A sua privacidade é importante para nós. É política do Agenda Tributária respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="/">Agenda Tributária</a>, e outros sites que possuímos e operamos.</p>\
                <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>\
                <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>\
                <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>\
                <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas <a href="/privacidade" target="_blank">políticas de privacidade</a>.</p>\
                <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>\
                <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.</p>\
                <h2>Política de Cookies do Agenda Tributária</h2>\
                <h3>O que são cookies?</h3>\
                <p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou 'quebrar' certos elementos da funcionalidade do site.</p>\
                <h3>Como usamos os cookies?</h3>\
                <p>Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa ou não deles, caso sejam usados ​​para fornecer um serviço que você usa.</p>\
                <h3>Desativar cookies</h3>\
                <p>Você pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita. A desativação de cookies geralmente resultará na desativação de determinadas funcionalidades e recursos deste site. Portanto, é recomendável que você não desative os cookies.</p>\
                <h3>Cookies que definimos</h3>\
                <ul>\
                    <li>&nbsp;&nbsp;Cookies relacionados à conta</li>\
                    <p>Se você criar uma conta connosco, usaremos cookies para o gerenciamento do processo de inscrição e administração geral. Esses cookies geralmente serão excluídos quando você sair do sistema, porém, em alguns casos, eles poderão permanecer posteriormente para lembrar as preferências do seu site ao sair.</p>\
                    <li>&nbsp;&nbsp;Cookies relacionados ao login</li>\
                    <p>Utilizamos cookies quando você está logado, para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página. Esses cookies são normalmente removidos ou limpos quando você efetua logout para garantir que você possa acessar apenas a recursos e áreas restritas ao efetuar login.</p>\
                    <li>&nbsp;&nbsp;Cookies relacionados a boletins por e-mail</li>\
                    <p>Este site oferece serviços de assinatura de boletim informativo ou e-mail e os cookies podem ser usados ​​para lembrar se você já está registrado e se deve mostrar determinadas notificações válidas apenas para usuários inscritos / não inscritos.</p>\
                    <li>&nbsp;&nbsp;Pedidos processando cookies relacionados</li>\
                    <p>Este site oferece facilidades de comércio eletrônico ou pagamento e alguns cookies são essenciais para garantir que seu pedido seja lembrado entre as páginas, para que possamos processá-lo adequadamente.</p>\
                    <li>&nbsp;&nbsp;Cookies relacionados a pesquisas</li>\
                    <p>Periodicamente, oferecemos pesquisas e questionários para fornecer informações interessantes, ferramentas úteis ou para entender nossa base de usuários com mais precisão. Essas pesquisas podem usar cookies para lembrar quem já participou numa pesquisa ou para fornecer resultados precisos após a alteração das páginas.</p>\
                    <li>&nbsp;&nbsp;Cookies relacionados a formulários</li>\
                    <p>Quando você envia dados por meio de um formulário como os encontrados nas páginas de contacto ou nos formulários de comentários, os cookies podem ser configurados para lembrar os detalhes do usuário para correspondência futura.</p>\
                    <li>&nbsp;&nbsp;Cookies de preferências do site</li>\
                    <p>Para proporcionar uma ótima experiência neste site, fornecemos a funcionalidade para definir suas preferências de como esse site é executado quando você o usa. Para lembrar suas preferências, precisamos definir cookies para que essas informações possam ser chamadas sempre que você interagir com uma página for afetada por suas preferências.</p>\
                </ul>\
                <h3>Cookies de Terceiros</h3>\
                <p>Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.</p>\
                <ul>\
                    <li>&nbsp;&nbsp;Google Analytics</li>\
                    <p>Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis ​​da Web, para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas, para que possamos continuar produzindo conteúdo atraente.</p>\
                </ul>\
                <p>Para mais informações sobre cookies do Google Analytics, consulte a página oficial do Google Analytics.</p>\
                <p>As análises de terceiros são usadas para rastrear e medir o uso deste site, para que possamos continuar produzindo conteúdo atrativo. Esses cookies podem rastrear itens como o tempo que você passa no site ou as páginas visitadas, o que nos ajuda a entender como podemos melhorar o site para você.</p>\
                <p>Periodicamente, testamos novos recursos e fazemos alterações subtis na maneira como o site se apresenta. Quando ainda estamos testando novos recursos, esses cookies podem ser usados ​​para garantir que você receba uma experiência consistente enquanto estiver no site, enquanto entendemos quais otimizações os nossos usuários mais apreciam.</p>\
                <p>À medida que vendemos produtos, é importante entendermos as estatísticas sobre quantos visitantes de nosso site realmente compram e, portanto, esse é o tipo de dados que esses cookies rastrearão. Isso é importante para você, pois significa que podemos fazer previsões de negócios com precisão que nos permitem analizar nossos custos de publicidade e produtos para garantir o melhor preço possível.</p>\
                <p>O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você.<br>Para mais informações sobre o Google AdSense, consulte as FAQs oficiais sobre privacidade do Google AdSense.</p>\
                <p>Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental usados ​​por este site foram projetados para garantir que você forneça os anúncios mais relevantes sempre que possível, rastreando anonimamente seus interesses e apresentando coisas semelhantes que possam ser do seu interesse.</p>\
                <p>Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos clientes acessaram o site através de um dos sites de nossos parceiros, para que possamos creditá-los adequadamente e, quando aplicável, permitir que nossos parceiros afiliados ofereçam qualquer promoção que pode fornecê-lo para fazer uma compra.</p>\
                <h3>Mais informações</h3>\
                <p>Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.</p>\
                <p>Esta política é efetiva a partir de <strong>Setembro</strong>/<strong>2020</strong>.</p>\
            </article>`;

    };

};

function termosUso() {

    if (document.querySelector('#termos') === null) {

    } else {

        document.querySelector('#termos').innerHTML = `\
            <article>\
                <h2>1. Termos</h2>\
                <p>Ao acessar ao site <a href="/">Agenda Tributária</a>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p>\
                <h2>2. Uso de Licença</h2>\
                <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Agenda Tributária , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>\
                <ul class="lista-para">\
                    <p>&nbsp;&nbsp;Modificar ou copiar os materiais;</p>\
                    <p>&nbsp;&nbsp;Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</p>\
                    <p>&nbsp;&nbsp;Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Agenda tributária;</p>\
                    <p>&nbsp;&nbsp;Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</p>\
                    <p>&nbsp;&nbsp;Transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.</p>\
                </ul>\
                <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Agenda Tributária a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.</p>\
                <h2>3. Isenção de responsabilidade</h2>\
                <ul class="lista-para">\
                    <p>&nbsp;&nbsp;Os materiais no site da Agenda Tributária são fornecidos 'como estão'. Agenda Tributária não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>\
                    <p>&nbsp;&nbsp;Além disso, o Agenda Tributária não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</p>
                </ul>\
                <h2>4. Limitações</h2>\
                <p>Em nenhum caso o Agenda Tributária ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Agenda tributária, mesmo que Agenda Tributária ou um representante autorizado da Agenda Tributária tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.</p>\
                <h3>Precisão dos materiais</h3>\
                <p>Os materiais exibidos no site da Agenda Tributária podem incluir erros técnicos, tipográficos ou fotográficos. Agenda Tributária não garante que qualquer material em seu site seja preciso, completo ou atual. Agenda Tributária pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Agenda Tributária não se compromete a atualizar os materiais.</p>\
                <h2>6. Links</h2>\
                <p>O Agenda Tributária não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Agenda Tributária do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>\
                <h3>Modificações</h3>\
                <p>O Agenda Tributária pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>\
                <h3>Lei aplicável</h3>\
                <p>Estes termos e condições são regidos e interpretados de acordo com as leis do Agenda Tributária e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>\
            </article>`;

    };

};

function carregarContato() {

    if (document.querySelector('#carregar-contato') === null) {

    } else {

        document.querySelector('#contato-sucesso').innerHTML = '\
            <p>Obrigado por entrar em contato, retornaremos em breve!!</p>';

        document.querySelector('#carregar-contato').innerHTML = `\
            <div class="div-contato">\
            <label for="div-nome-contato">Nome</label>\
            </div>\
            <div id="div-nome-contato" class="entradas-contato">\
                <input type="text" name="nome-contato" id="nome-contato" class="input-contato" placeholder="seu nome" autocomplete="off">\
            </div>\
            <div class="div-contato">\
                <label for="div-email-contato">E-mail</label>\
            </div>\
            <div id="div-email-contato" class="entradas-contato">\
                <input type="email" name="email-contato" id="email-contato" class="input-contato" placeholder="contato@contato.com" autocomplete="off">\
            </div>\
            <div class="div-contato">\
                <label for="div-mensagem-contato">Mensagem</label>\
            </div>\
            <div id="div-mensagem-contato" class="entradas-contato">\
                <textarea name="mensagem-contato" id="mensagem-contato" cols="30" rows="10" class="input-contato"></textarea>\
            </div>\
            <div id="div-enviar-contato" class="entradas-contato">\
                <input type="submit" name="enviar-contato" id="enviar-contato" value="ENVIAR&nbsp; &#128236;">\
            </div>`;

    };

};

function contatoSucesso() {

    if (document.querySelector('#contato-pagina') === null) {

    } else {

        let sucesso = document.querySelector('#msg-contato').textContent;

        if (sucesso == 1020) {

            document.querySelector('#contato-sucesso').style.display = 'block';

            setTimeout(function() { 

                document.querySelector('#contato-sucesso').style.display = 'none';  

            }, 3000);
            
        } else {};

    };

};

function mapa() {

    if (document.querySelector('#mapa') === null) {

    } else {

        document.querySelector('#mapa').innerHTML = `\
            <ul>\
                <li>&nbsp;&nbsp;<a href="/">Agenda Tributária</a></li>\
                    <p>Página principal do site e do aplicativo. Nessa página você encontra todo o conteúdo e as principais informações do site.</p>\
                <li>&nbsp;&nbsp;<a href="/privacidade">Políticas de Prividade</a></li>\
                    <p>A política e a privacidade do Agenda Tributária em relação a qualquer informação sua que possamos coletar no site Agenda Tributária, e outros sites que possuímos e operamos.</p>\
                <li>&nbsp;&nbsp;<a href="/termos">Termos de Uso</a></li>\
                    <p>Os termos de uso que o usuário concorda ao navegar dentro deste site. Acesse clicando no nome da página para saber mais.</p>\
                <li>&nbsp;&nbsp;<a href="/contato">Contato</a></li>\
                    <p>Caso precise entrar em contato com o desenvolvedor do site ou queira mandar alguma mensagem, sugestão essa é a página.</p>\
                <li>&nbsp;&nbsp;<a href="/mapa">Mapa do Site</a></li>\
                    <p>Mapa das páginas do site, detalhando o contéudo de cada página de forma breve e resumida.</p>\
            </ul>`;

    };

};

// FUNCOES JAVASCRIPT

preLoad();
entrada();
verificarErro();
observacao();
tutorial();
tagSite();
termosNavegacao();
privacidade();
termosUso();
carregarContato();
contatoSucesso();
mapa();

// FUNCOES JQUERY

$(document).ready(function($) {

    if (Cookies.get('hide-div') == 20204005090) {

        $('#termos-navegacao').remove();

    };

    $('#fechar-cookies').click(function() {

        $('#termos-navegacao').remove();
        Cookies.set('hide-div', 20204005090);

    });
    
});
