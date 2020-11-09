/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

function __experimentalBlockVariationTransforms( { selectedBlockClientId } ) {
	const [ variationsSelectValue, setVariationsSelectValue ] = useState( '' );
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );
	const { variations } = useSelect(
		( select ) => {
			const { getBlockVariations } = select( 'core/blocks' );
			const { getBlockName } = select( 'core/block-editor' );
			const blockName =
				selectedBlockClientId && getBlockName( selectedBlockClientId );
			return {
				variations:
					blockName && getBlockVariations( blockName, 'transform' ),
			};
		},
		[ selectedBlockClientId ]
	);
	if ( ! variations?.length ) return null;

	const selectOptions = [
		{ value: '', label: __( 'Select a variation' ) },
		...variations.map( ( variation ) => ( {
			value: variation.name,
			label: variation.title,
		} ) ),
	];
	const onSelectVariation = ( variationName ) => {
		setVariationsSelectValue( variationName );
		if ( ! variationName ) return;
		updateBlockAttributes( selectedBlockClientId, {
			...variations.find( ( { name } ) => name === variationName )
				.attributes,
		} );
	};
	return (
		<div className="block-editor-block-variation-transforms">
			<SelectControl
				label={ __( 'Transform to variation' ) }
				value={ variationsSelectValue }
				options={ selectOptions }
				onChange={ onSelectVariation }
			/>
		</div>
	);
}

export default __experimentalBlockVariationTransforms;
