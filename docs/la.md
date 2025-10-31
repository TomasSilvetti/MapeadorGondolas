Claude quiero hacer una pagina web para hacer un software para mi supermercado. La pagina web sera simple, tendra un "mapeador" de gondolas.

La idea es que usemos una base de datos donde tengamos cargado los productos del supermercado, con su precio, margen de ganancia, popularidad, categoria del producto, etc.

La idea es poder armar en una especie de sandbox, la vista desde arriba del super, poniendo las gondolas de forma que armemos un "mapa del super".
 al hacer click en una gondola se mostrarian una nueva vista de frente a la gondola donde se podran ver los productos de la gondola.

Cada gondola tendra:
- Una cantidad de estantes
- Una cantidad de productos por estante ("espacio")
- Restricciones de categoria de productos para cada espacio, es decir, podra configurarse que categorias pueden ponerse en ese espacio o no pueden ponerse en ese espacio

Luego de acomodar en el sandbox las gondolas y configuradas las gondolas. Correr una  algoritmo solver que seleccione el mejor lugar para cada producto.
 La idea es que los productos a los que se les gana mayor margen y que mas se venden, configurados con cierto peso de popularidad y margen de ganancia, se pongan a la altura de la vista de las personas (supongamos que ese es el estante 4 y 5 contando desde abajo) y de ahi los productos menos populares y a que tienen menos margen de ganancia se posicionen alejandose de los estantes " mas visibles" ( es decir para arriba o pars abajo)

Que arquitectura, que consideraciones tendria que tener para hacer la pagina, hazme preguntas del stack tecnologico pars determinar cual seria la mejor opcion