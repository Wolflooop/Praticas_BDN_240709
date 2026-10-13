LOAD DATA LOCAL INFILE 'C:\\Users\\SilverWolf\\Desktop\\Praticas_BDN_240709\\Practica 03\\seeds\\tb_products_10000.csv'
INTO TABLE tb_products
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    ID,
    SKU,
    name,
    description,
    current_price,
    current_stock,
    @status
)
SET
    status = IF(@status = '1', b'1', b'0'),
    creation_date = CURRENT_TIMESTAMP,
    last_update = CURRENT_TIMESTAMP;