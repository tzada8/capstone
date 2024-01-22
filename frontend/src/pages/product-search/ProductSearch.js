import React from "react";
import ProductOption from "../../components/ProductOption";

function ProductSearch() {
    // TODO: TEMP
    const data = [
        {
          "extensions": [
            "CMOS",
            "With Video",
            "Black"
          ],
          "link": "https://www.bestbuy.com/site/canon-eos-rebel-t7-dslr-video-camera-with-18-55mm-lens-black/6323758.p?skuId=6323758&ref=212&loc=1",
          "position": 1,
          "price": 479.99,
          "rating": 4.7,
          "reviews": 7542,
          "source": "Best Buy",
          "thumbnail": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRvn2Z6xdOLEQkTeKAcrQHbMyBUpBCXc3jAIg5dONHa7WnzNfdyyHSrFG29zuzTut4bl4CqgZLcMgVhh69L1e0jDtzddkeFLKBWfgU8pk80DHByrgpk4puumA&usqp=CAE",
          "title": "Canon Eos Rebel T7 Digital SLR Camera 18-55mm f/3.5-5.6 Is II Kit"
        },
        {
          "extensions": [
            "CMOS",
            "With Video",
            "Black"
          ],
          "link": "https://www.walmart.com/ip/Canon-EOS-2000D-Rebel-T7-24-1MP-CMOS-1080p-DSLR-Camera-EF-S-18-55mm-f-3-5-5-6-Lens-Intl-Model/213743525?wmlspartner=wlpa&selectedSellerId=101454533",
          "position": 2,
          "price": 399.0,
          "rating": 4.7,
          "reviews": 7542,
          "source": "Walmart - Digi-Master",
          "thumbnail": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSEUpiIzIaKea1_ofme1-Smi6pHRgtitZkqrnDRyCnG1MzhciPlaZqJcDFWSSzi8abXSbAvbyBjb0Gny4PIx6Uv8J78rr4l4SWB-QuubdZM&usqp=CAE",
          "title": "Canon Eos 2000D Kit (EF-S 18-55mm Is II)"
        },
        {
            "extensions": [
              "CMOS",
              "With Video",
              "Black"
            ],
            "link": "https://www.walmart.com/ip/Canon-EOS-Rebel-T7-DSLR-Camera-Bundle-with-Canon-EF-S-18-55mm-f-3-5-5-6-is-II-Lens-2pc-SanDisk-32GB-Memory-Cards-Accessory-Kit/280843241?wmlspartner=wlpa&selectedSellerId=101454533",
            "position": 3,
            "price": 549.0,
            "rating": 4.7,
            "reviews": 7542,
            "source": "Walmart - Digi-Master",
            "thumbnail": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR1yzd8Id2UAIcyrVpz5yHa16b9mr8ZmZhBXfjwP45Te6HHfd9QvesvTTEf3kzN-WK5mXMVLyswhsX2B3EBcXlbsM__u7YWhsXCpIIDAKc&usqp=CAE",
            "title": "Canon Eos Rebel T7 DSLR Camera Bundle with Canon EF-S 18-55mm f/3.5-5.6 Is II ..."
          },
          {
            "extensions": [
              "With Video",
              "Crop Sensor"
            ],
            "link": "https://www.walmart.com/ip/Canon-EOS-Rebel-T100-4000D-DSLR-Camera-Body-Only/777666746?wmlspartner=wlpa&selectedSellerId=4720",
            "position": 4,
            "price": 284.39,
            "rating": 4.5,
            "reviews": 2030,
            "source": "Walmart - 6AVE Electronics",
            "thumbnail": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTmTlu9UHpsi4n5IBHW4klDHyFYSckMb65a8NscDKe0yvtda5Qu2nrpPbLn9u-2xx8XkbJ-0Jbahf2RYe9-YCen8o2X4zgalQqkANh28XxSbYV5JcL5mFf7&usqp=CAE",
            "title": "Canon Eos Rebel T100 / 4000D DSLR Camera (Kit Box)"
          },
    ]

	return (
		<div>
            {data.map(product => (
                <ProductOption
                    thumbnail={product.thumbnail}
                    title={product.title}
                    rating={product.rating}
                    reviews={product.reviews}
                    extensions={product.extensions}
                    price={product.price}
                    link={product.link}
                    source={product.source}
                />
            ))}
		</div>
	);
}

export default ProductSearch;
