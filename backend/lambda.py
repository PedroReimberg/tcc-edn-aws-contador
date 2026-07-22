import json
import boto3

# Conecta ao DynamoDB
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DynamoDBTable') 

def lambda_handler(event, context):
  # Captura o método HTTP (GET ou POST) vindo do API Gateway V2
  http_method = event.get('requestContext', {}).get('http', {}).get('method', '')
  
  # Cabeçalhos de CORS exigidos pelo navegador
  headers = {
      'Access-Control-Allow-Origin': '*', # Pode alterar para a URL do S3 por segurança, mas o API Gateway já bloqueia requisições de outras URLs
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
  }
  
  try:
      if http_method == 'GET':
          # Apenas lê o banco de dados
          response = table.get_item(Key={'id': 'hits'})
          count = response.get('Item', {}).get('quantidade', 0)
          return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'hits': int(count)})}
          
      elif http_method == 'POST':
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
                  UpdateExpression='ADD quantidade :dec',
                  ExpressionAttributeValues={':dec': -1},
                  ReturnValues='UPDATED_NEW'
              )
          else:
              # Incrementa +1 no DynamoDB
              response = table.update_item(
                  Key={'id': 'hits'},
                  UpdateExpression='ADD quantidade :inc',
                  ExpressionAttributeValues={':inc': 1},
                  ReturnValues='UPDATED_NEW'
              )
              
          count = response['Attributes']['quantidade']
          return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'hits': int(count)})}

      elif http_method == 'OPTIONS':
          # Responde ao teste (Preflight) do navegador com sucesso
          return {'statusCode': 200, 'headers': headers, 'body': ''}
          
      else:
          return {'statusCode': 400, 'headers': headers, 'body': 'Metodo nao suportado'}
          
  except Exception as e:
      print(e) # O CloudWatch (autorizado na Role) vai gravar este erro
      return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'Erro interno no servidor'})}
