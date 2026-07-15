# Bucket policy

- Permite a leitura de **TODOS** os arquivos do bucket S3 utilizado para *Static Hosting Website* com a configuração de *Block all public access* em *Off*
- [BUCKET-NAME] = Nome do bucket

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::[BUCKET-NAME]/*"
        }
    ]
}
```
