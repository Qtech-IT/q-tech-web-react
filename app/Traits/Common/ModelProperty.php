<?php

namespace App\Traits\Common;

trait ModelProperty
{

   
    /**
     * Summary of getCommonProperty
     * @param mixed $modelDisplayName
     * @param mixed $modelName
     * @param mixed $resourcePagePrefix
     * @param mixed $routePrefix
     * @param mixed $basePagePrefix
     * @return array{modelDisplayName: string|null, modelName: string|null, pagePrefix: string, resourcePagePrefix: string|null, routePrefix: string|null}
     */
    public function getCommonProperty(
        ?string $modelDisplayName   = null, 
        ?string $modelName          = null, 
        ?string $resourcePagePrefix = null, 
        ?string $routePrefix        = null,
        ?string $basePagePrefix     = 'Backend'
    ): array {
        return [
            'modelDisplayName'   => $modelDisplayName,
            'modelName'          => $modelName,
            'resourcePagePrefix' => $resourcePagePrefix,
            'routePrefix'        => $routePrefix,
            'pagePrefix'         => $basePagePrefix."/". $resourcePagePrefix."/"
        ];
    }

}
