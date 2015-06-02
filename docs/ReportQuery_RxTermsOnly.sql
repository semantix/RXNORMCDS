select distinct scd_review.SCD_rxcui,
		scd_review.review_status,
		scd_df.DF_str, 
		scd_df.SCD_str, 
		scd_rxterms.ROUTE_rxt, 
		scd_rxterms.NEWDF_rxt,
		maps.orig_term_name,
		maps.orig_term_source,
		maps.prop_attrib_id,
		maps.prop_attrib_categ,
		maps.prop_attrib_attrib,
		maps.prop_term_id,
		maps.prop_term_parent_id,
		maps.prop_term_name
from scd_review
left join scd_rxterms on (scd_review.SCD_rxcui = scd_rxterms.SCD_rxcui)
left join scd_df on (scd_review.SCD_rxcui = scd_df.SCD_rxcui)
left join (select distinct mappings.orig_term_name, 
					mappings.orig_term_source,
					proposed_attribs.id as prop_attrib_id,
					proposed_attribs.category as prop_attrib_categ,
					proposed_attribs.attribute as prop_attrib_attrib,
					terms.id as prop_term_id,
					terms.parent_id as prop_term_parent_id,
					terms.name as prop_term_name
			from mappings
			join proposed_attribs on (mappings.proposed_attrib_id = proposed_attribs.id)
			join terms on (mappings.proposed_term_id = terms.id)) as maps
		on ((maps.orig_term_source = "NDFRT" and maps.orig_term_name = scd_df.DF_str)
			or(maps.orig_term_source = "RxTerms" and maps.orig_term_name = scd_rxterms.ROUTE_rxt)
			or(maps.orig_term_source = "RxTerms" and maps.orig_term_name = scd_rxterms.NEWDF_rxt))					
where scd_review.review_status != "Incomplete"
	and scd_review.review_priority < 100
	and maps.orig_term_source = 'RxTerms'
order by scd_review.SCD_rxcui, maps.orig_term_source
