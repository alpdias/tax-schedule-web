# -*- coding: utf-8 -*-

'''
Criado em 09/2020
@Autor: Paulo https://github.com/alpdias
'''

from django.shortcuts import render
from django.http import HttpResponse
import requests
from bs4 import BeautifulSoup
from datetime import date
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings

atual = date.today()
mes = atual.month
ano = atual.year
mesAtual = mes 
mesAnterior = (mes - 1)
mesProximo = (mes + 1)

def mesNome(mesNumero):

    """
    -> Retornar o nome do mes equivalente ao numero
    :param mes: Numero do mes
    :return: Nome do mes
    """

    mesNome = ''

    if mesNumero == 1:
        mesNome = 'janeiro'
        
    elif mesNumero == 2:
        mesNome = 'fevereiro'
        
    elif mesNumero == 3:
        mesNome = 'marco'
        
    elif mesNumero == 4:
        mesNome = 'abril'
        
    elif mesNumero == 5:
        mesNome = 'maio'
        
    elif mesNumero == 6:
        mesNome = 'junho'
        
    elif mesNumero == 7:
        mesNome = 'julho'
        
    elif mesNumero == 8:
        mesNome = 'agosto'
        
    elif mesNumero == 9:
        mesNome = 'setembro'
        
    elif mesNumero == 10:
        mesNome = 'outubro'
        
    elif mesNumero == 11:
        mesNome = 'novembro'
        
    elif mesNumero == 12:
        mesNome = 'dezembro'

    return mesNome


def pegarURL(mesAgenda, anoAgenda=ano):

    """
    -> Obtem as url's dos dias da agenda tributaria
    :param mes: Mes de referencia
    :param ano: Ano de referencia
    return: Retorna um dicionario com os dias e as url's dos eventos da agenda
    """

    url = f'https://receita.economia.gov.br/acesso-rapido/agenda-tributaria/agenda-tributaria-{anoAgenda}/agenda-tributaria-{mesAgenda}-{anoAgenda}/agenda-tributaria-{mesAgenda}-{anoAgenda}'
    cabecalho = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36'} 
    requisicao = requests.get(url, headers=cabecalho)
    
    # melhorar a perfomace trocar html.parser por html5lib ou lxml (execucao demorando mais de 30s)
    soup = BeautifulSoup(requisicao.text, 'html5lib')
    
    corpo = soup.find('div', {'id': 'parent-fieldname-text'}) 
    elementos = corpo.find('ul')
    links =  elementos.findAll('a', href=True)
    dicio = {}

    for a in links:
        caminho = a['href'] 
        dia = a.text.strip() 
        dicio[dia] = f'{caminho}'

    return dicio


def agenda(refMes, tipoDoc, tipoAtv, refAno=ano):

    """
    -> Obtem os eventos da agenda tributaria
    :param refMes: Mes de referencia
    :param refAno: Ano de referencia
    return: Retorna uma lista com os eventos da agenda tributaria
    """

    if refMes < 10:
        mesFormat = f'0{refMes}'
        
    else:
        mesFormat = refMes

    calendario = pegarURL(mesNome(refMes), refAno) 
    diaEventos = []

    for k, v in calendario.items(): 
        diaEventos.append(k)

    for k, v in calendario.items():
        url = v
        cabecalho = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36'}
        requisicao = requests.get(url, headers=cabecalho) 
        
        # melhorar a perfomace trocar html.parser por html5lib ou lxml (execucao demorando mais de 30s)
        soup = BeautifulSoup(requisicao.text, 'html5lib') 
        
        corpo = soup.find('div', {'id': 'parent-fieldname-text'}) 
        elemento = corpo.findAll('tbody') 
        eventosConteudo = []

        for i in elemento:         
            item = i.findAll('td')
            quantidade = len(item)

            if quantidade % 3 != 0:
                pass
            
            else:
                for i in item:
                    itemTexto = (i.text).replace('\xa0','').replace('\n','').replace(';','').replace(',','')
                    eventosConteudo.append(itemTexto)

        conteudo = {} 
        conteudo[diaEventos[0]] = eventosConteudo
        diaEventos.pop(0)
        qtd = len(eventosConteudo)
        resultado = []

        servico = ['1007', '1120', '1163', '1406', '1430', '1503', '1830', '1910', '1929', '1945', '5952', '5979', '5960', '5987', '2985', '2991',
                    '0561', '0588', '1889', '1708', '2852', '2879', '2950', '2976', '2003', '2011', '2020', '2100', '2119', '2208', '2216', '2658',
                    '2640', '2631', '3966', '8109', '8301', '3703', '6824', '6912', '0190', '0220', '9100', '9222', '7042', '7093', '9114',  '7122',
                    '0285', '0873', '4324', '4359', 'DAS (Documento de Arrecadação do Simples Nacional)', 'DAS-MEI (Documento de Arrecadação Simplificada do Microempreendedor Individual)']
        comercio = ['9331', '8741', '1910', '5952', '5979', '5960', '5987', '2985', '2991', '0561', '0588', '1708', '8045', '2852', '2879', '2003',
                    '2011', '2100', '2119', '2208', '2607', '2615', '2704', '2712', '6106', '6505', '0924', '3699', '8109', '8301', '3703', '6824',
                    '6912', '1921', '0679', '0691', '0906', '2172', '6840', '5856', '1840', '0760', '0776', '0929', '0190', '2362', '5993', '3770',
                    '3746', '9100', '9222', '7042', '7093', '7114', '7122', '4983', '4990', '0285', '0873', '1136', '1165', '4020', '4042', '4324',
                    '4359', '4135', '4136', 'DAS (Documento de Arrecadação do Simples Nacional)', 'DAS-MEI (Documento de Arrecadação Simplificada do Microempreendedor Individual)',
                    '1077', '1120', '1163', '1406', '1473', '1503', '1830', '1910', '1929', '1945']
        industria = ['1020', '3699', '9385', '3746', '6106', '6505', '5952', '5979', '5960', '5987', '2985', '2991', '0561', '0588', '3533', '3562',
                    '1708', '8045', '2119', '0676', '1097', '5110', '5123', '0668', '0821', '0838', '8109', '8301', '3703', '8496', '6912', '8645',
                    '5856', '2362', '5993', '3770', '3746', '9100', '9222', '7122', '1210', '3858', '4020', '4042', '2852', '2879', '2100']
        financeiro = ['8053', '3426', '6800', '6813', '5273', '8468', '5557', '5232','5035', '5286', '0490', '1150', '4290', '5220', '6854', '7893',
                    '5952', '5979', '5960', '5987', '2985', '2991', '4574', '7987', '0561', '0588', '1889', '1708', '8045', '6106', '6505', '8109',
                    '8301', '6912', '2172', '5232', '0473', '0190', '4600', '8523', '6015', '2927', '0220', '5993', '3317', '0231', '0507', '2030',
                    '2469', '9100', '9222', '7122', '4983', '4990', '2852', '2879', '2100']

        if tipoDoc == 'virgula':

            if tipoAtv == 'S':
                while qtd > 0:
                    
                    for k, v in conteudo.items():
                        d = f'{k}/{mesFormat}/{refAno}'
                        data = datetime.strptime(d, '%d/%m/%Y').date()
                        intervalo = timedelta(3)
                        alerta = (data - intervalo)
                        alerta = alerta.strftime('%d/%m/%Y')

                        if v[0] in servico:
                            resultado.append(f'{v[0]}, {k}/{mesFormat}/{refAno}, {k}/{mesFormat}/{refAno}, Verdadeiro, Verdadeiro, {alerta}, Competência: {v[2]}' + ' ' * 184 + f'https://receita.economia.gov.br/acesso-rapido/agenda-tributaria, {v[1]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
                        
                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
            
            elif tipoAtv == 'C':
                while qtd > 0:
                    
                    for k, v in conteudo.items():
                        d = f'{k}/{mesFormat}/{refAno}'
                        data = datetime.strptime(d, '%d/%m/%Y').date()
                        intervalo = timedelta(3)
                        alerta = (data - intervalo)
                        alerta = alerta.strftime('%d/%m/%Y')

                        if v[0] in comercio:
                            resultado.append(f'{v[0]}, {k}/{mesFormat}/{refAno}, {k}/{mesFormat}/{refAno}, Verdadeiro, Verdadeiro, {alerta}, Competência: {v[2]}' + ' ' * 184 + f'https://receita.economia.gov.br/acesso-rapido/agenda-tributaria, {v[1]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
                        
                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
            
            elif tipoAtv == 'I':
                while qtd > 0:
                    
                    for k, v in conteudo.items():
                        d = f'{k}/{mesFormat}/{refAno}'
                        data = datetime.strptime(d, '%d/%m/%Y').date()
                        intervalo = timedelta(3)
                        alerta = (data - intervalo)
                        alerta = alerta.strftime('%d/%m/%Y')

                        if v[0] in industria:
                            resultado.append(f'{v[0]}, {k}/{mesFormat}/{refAno}, {k}/{mesFormat}/{refAno}, Verdadeiro, Verdadeiro, {alerta}, Competência: {v[2]}' + ' ' * 184 + f'https://receita.economia.gov.br/acesso-rapido/agenda-tributaria, {v[1]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
                        
                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
            
            elif tipoAtv == 'F':
                while qtd > 0:
                    
                    for k, v in conteudo.items():
                        d = f'{k}/{mesFormat}/{refAno}'
                        data = datetime.strptime(d, '%d/%m/%Y').date()
                        intervalo = timedelta(3)
                        alerta = (data - intervalo)
                        alerta = alerta.strftime('%d/%m/%Y')

                        if v[0] in financeiro:
                            resultado.append(f'{v[0]}, {k}/{mesFormat}/{refAno}, {k}/{mesFormat}/{refAno}, Verdadeiro, Verdadeiro, {alerta}, Competência: {v[2]}' + ' ' * 184 + f'https://receita.economia.gov.br/acesso-rapido/agenda-tributaria, {v[1]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
                        
                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
        
            else:
                while qtd > 0:
                    
                    for k, v in conteudo.items():
                        d = f'{k}/{mesFormat}/{refAno}'
                        data = datetime.strptime(d, '%d/%m/%Y').date()
                        intervalo = timedelta(3)
                        alerta = (data - intervalo)
                        alerta = alerta.strftime('%d/%m/%Y')
                        resultado.append(f'{v[0]}, {k}/{mesFormat}/{refAno}, {k}/{mesFormat}/{refAno}, Verdadeiro, Verdadeiro, {alerta}, Competência: {v[2]}' + ' ' * 184 + f'https://receita.economia.gov.br/acesso-rapido/agenda-tributaria, {v[1]}\n')
                        del conteudo[k][0]
                        del conteudo[k][0]
                        del conteudo[k][0]
                        qtd = (qtd - 3)

        else:
            
            if tipoAtv == 'S':
                while qtd > 0:

                    for k, v in conteudo.items():
                        if v[0] in servico:
                            resultado.append(f'{k}/{mesFormat}/{refAno}; {v[0]}; {v[1]}; {v[2]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

            if tipoAtv == 'C':
                while qtd > 0:

                    for k, v in conteudo.items():
                        if v[0] in comercio:
                            resultado.append(f'{k}/{mesFormat}/{refAno}; {v[0]}; {v[1]}; {v[2]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

            if tipoAtv == 'I':
                while qtd > 0:

                    for k, v in conteudo.items():
                        if v[0] in industria:
                            resultado.append(f'{k}/{mesFormat}/{refAno}; {v[0]}; {v[1]}; {v[2]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

            if tipoAtv == 'F':
                while qtd > 0:

                    for k, v in conteudo.items():
                        if v[0] in financeiro:
                            resultado.append(f'{k}/{mesFormat}/{refAno}; {v[0]}; {v[1]}; {v[2]}\n')
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)

                        else:
                            del conteudo[k][0]
                            del conteudo[k][0]
                            del conteudo[k][0]
                            qtd = (qtd - 3)
                
            else:
                while qtd > 0:

                    for k, v in conteudo.items():
                        resultado.append(f'{k}/{mesFormat}/{refAno}; {v[0]}; {v[1]}; {v[2]}\n')
                        del conteudo[k][0]
                        del conteudo[k][0]
                        del conteudo[k][0]
                        qtd = (qtd - 3)


        yield resultado


def saida(mesRef, tipoRef, tipoEmp):
    
    """
    -> Faz a requisicao dos eventos para a agenda tributaria
    :return: Retorna um dicionario com o a agenda tributaria
    """
    
    requisicao = agenda(mesRef, tipoRef, tipoEmp)
    agendaLista = []
    agendaDicio = {}

    for i in requisicao:
        agendaLista.append(i)
    
    if tipoRef == 'virgula':
        cabecalho = ['Assunto, Data de inicio, Data de termino, O dia inteiro, Lembrete ativado, Data do lembrete, Descricao, Local\n']
        agendaLista.insert(0, cabecalho)
        
    else:
        pass

    agendaDicio['agenda'] = agendaLista
        
    return agendaDicio   
  
    
def inicio(request):
    
    """
    -> Funcao para renderizar o aplicativo principal
    :param request: Requisicao em HTML
    :return: Retorna a renderizacao da tela inicial do aplicativo e o conteudo da requisicao
    """
    
    if request.method == 'POST':
        mesRef = int(request.POST.get(['mes-referencia'][0]))
        tipoRef = request.POST.get('tipo')
        tipoEmp = request.POST.get(['tipo-empresa'][0])

        try:
            calendario = saida(mesRef, tipoRef, tipoEmp)
            calendario['tipo'] = tipoRef

        except:
            msgErro = 'Mês de referência inválido, ou conteúdo indisponível!!'
            tab = ' '
            calendario = {}
            calendario['agenda'] = (f'\n\n\n{tab * 10}{msgErro}\
\n\n{tab * 25}{msgErro}\
\n\n{tab * 35}{msgErro}')
            calendario['erro'] = 404

    else:
        calendario = {}

    return render(request, 'agenda/index.html', calendario)
    

def privacidade(request):

    """
    -> Funcao para renderizar a pagina de privacidade do site
    :return: Retorna a renderizacao da pagina de privacidade do site
    """

    return render(request, 'agenda/privacidade.html')


def termos(request):

    """
    -> Funcao para renderizar a pagina de termos do site
    :return: Retorna a renderizacao da pagina de termos do site
    """

    return render(request, 'agenda/termos.html')


def contato(request):

    """
    -> Funcao para receber informações de contato e enviar email
    :return: Retorna a renderizacao da tela de contato
    """

    if request.method == 'POST':
        assunto = 'Agenda Tributária'
        nome = request.POST.get('nome-contato')
        email = request.POST.get('email-contato')
        mensagem = request.POST.get('mensagem-contato')

        corpo = f'{nome}\
\n\n{email}\
\n\n{mensagem}\
\n\nhttps://web-app-agenda-tributaria.herokuapp.com/'

        enviar = settings.EMAIL_HOST_USER
        destinatarios = ["de8ac25948-1f320b@inbox.mailtrap.io"]
        send_mail(assunto, corpo, enviar, destinatarios)

        contato = {}
        contato['sucesso'] = 1020

    else:
        contato = {}

    return render(request, 'agenda/contato.html', contato)


def mapa(request):

    """
    -> Funcao para renderizar a pagina do mapa do site
    :return: Retorna a renderizacao da pagina do mapa do site
    """
    
    return render(request, 'agenda/mapa.html')

