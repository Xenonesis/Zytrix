// Type declarations for the Remix server build
export interface ServerBuild {
  entry: {
    module: {
      default: (request: Request, loadContext?: unknown) => Promise<Response>;
    };
  };
  routes: Record<
    string,
    {
      id: string;
      parentId?: string;
      path?: string;
      index?: boolean;
      caseSensitive?: boolean;
      module: {
        default?: React.ComponentType;
        ErrorBoundary?: React.ComponentType;
        action?: Function;
        loader?: Function;
        shouldRevalidate?: Function;
        meta?: Function;
        links?: Function;
        scripts?: Function;
        styles?: Function;
      };
    }
  >;
  assets: {
    routes: Record<
      string,
      {
        id: string;
        parentId?: string;
        path?: string;
        index?: boolean;
        caseSensitive?: boolean;
        hasAction: boolean;
        hasLoader: boolean;
        hasErrorBoundary: boolean;
        module: string;
        imports?: string[];
      }
    >;
  };
  future: {
    v3_fetcherPersist: boolean;
    v3_relativeSplatPath: boolean;
    v3_throwAbortReason: boolean;
    v3_lazyRouteDiscovery: boolean;
  };
}