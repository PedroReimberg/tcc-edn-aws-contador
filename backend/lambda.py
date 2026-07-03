import json
import boto3

# Inicializa o recurso do DynamoDB
dynamodb = boto3.resource('dynamodb')

# Nome da tabela do DynamoDB
table = dynamodb.Table('contador-teste') 

def lambda_handler(event, context):
    try:
        # Descobre qual foi o método HTTP usado na requisição (GET ou POST)
        # Em HTTP APIs do API Gateway, o método fica neste caminho do JSON:
        http_method = event.get('requestContext', {}).get('http', {}).get('method', 'GET')
        
        # NOVIDADE: Captura a rota/caminho da requisição para diferenciar o incremento do decremento
        path = event.get('requestContext', {}).get('http', {}).get('path', '/')
        
        total_acessos = 0
        
        if http_method == 'POST':
            # Verifica se o POST veio especificamente da rota de decremento do Frontend
            if '/decrement' in path:
                # O usuário removeu o interesse: decrementamos -1 usando a mesma estrutura ADD
                response = table.update_item(
                    Key={'id': 'hits'},
                    UpdateExpression='ADD quantidade_acessos :dec',
                    ExpressionAttributeValues={':dec': -1},
                    ReturnValues='UPDATED_NEW'
                )
            else:
                # O usuário clicou no botão padrão: somamos +1
                response = table.update_item(
                    Key={'id': 'hits'},
                    UpdateExpression='ADD quantidade_acessos :inc',
                    ExpressionAttributeValues={':inc': 1},
                    ReturnValues='UPDATED_NEW'
                )
            total_acessos = response['Attributes']['quantidade_acessos']
            
        else:
            # NO GET: O usuário apenas abriu a página, então apenas lemos o banco
            response = table.get_item(Key={'id': 'hits'})
            if 'Item' in response:
                total_acessos = response['Item'].get('quantidade_acessos', 0)

        return {
            'statusCode': 200,
            'headers': {
                # Troque pela URL exata do seu GitHub Pages
                'Access-Control-Allow-Origin': 'https://pedroreimberg.github.io', 
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            # Devolvemos 'hits' para bater com o que o seu Frontend espera ler
            'body': json.dumps({'hits': int(total_acessos)})
        }
        
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Erro ao processar o contador'})
        }