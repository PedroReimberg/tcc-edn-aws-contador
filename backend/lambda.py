import json
import boto3

# Inicializa o recurso do DynamoDB
dynamodb = boto3.resource('dynamodb')

# Nome da tabela do DynamoDB
table = dynamodb.Table('contador-teste') 

def lambda_handler(event, context):
    try:
        # Descobre qual foi o método HTTP usado na requisição (GET ou POST)
        http_method = event.get('requestContext', {}).get('http', {}).get('method', 'GET')
        
        total_acessos = 0
        
        if http_method == 'POST':
            # Lê o corpo enviado pelo frontend para saber a ação desejada
            body_data = {}
            if event.get('body'):
                try:
                    body_data = json.loads(event.get('body'))
                except Exception:
                    pass
            
            # Pega a ação ('increment' ou 'decrement'). Se não vier nada, assume increment.
            action = body_data.get('action', 'increment')
            
            if action == 'decrement':
                # Decrementa -1 no DynamoDB
                response = table.update_item(
                    Key={'id': 'hits'},
                    UpdateExpression='ADD quantidade_acessos :dec',
                    ExpressionAttributeValues={':dec': -1},
                    ReturnValues='UPDATED_NEW'
                )
            else:
                # Incrementa +1 no DynamoDB
                response = table.update_item(
                    Key={'id': 'hits'},
                    UpdateExpression='ADD quantidade_acessos :inc',
                    ExpressionAttributeValues={':inc': 1},
                    ReturnValues='UPDATED_NEW'
                )
                
            total_acessos = response['Attributes']['quantidade_acessos']
            
        else:
            # No GET: Apenas lemos o banco para exibir o total atual
            response = table.get_item(Key={'id': 'hits'})
            if 'Item' in response:
                total_acessos = response['Item'].get('quantidade_acessos', 0)

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': 'https://pedroreimberg.github.io', 
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'hits': int(total_acessos)})
        }
        
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Erro ao processar o contador'})
        }