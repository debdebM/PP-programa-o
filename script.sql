Create DATABASE LojaDeProdutos;
USE LojaDeProdutos;

create table Produtos (
	id INT PRIMARY KEY IDENTITY (1,1),
	nome NVARCHAR (100) NOT NULL,
	preco DECIMAL (10, 2) NOT NULL, 
);

INSERT INTO Produtos(nome,preco)
 VALUES ('Produto 1', 19.00),
 ('Os quatros produtos', 150.00);


SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME ='Produtos';
	