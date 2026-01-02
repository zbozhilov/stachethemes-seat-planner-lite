const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const commonConfig = {
  devtool: false,
  optimization: {
    splitChunks: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into separate files
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false, // Set to true only if using CSS modules
            },
          },
          'sass-loader', // Compiles Sass to CSS
        ],
      }
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css', // Output CSS file name
      chunkFilename: '[name].[contenthash].css',
    }),
    new DependencyExtractionWebpackPlugin({
      combineAssets: false,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-dom/client': 'ReactDOM',
  },
  watchOptions: {
    ignored: ['**/node_modules/**', '**/assets/**'],
  },
};

const developmentConfig = {
  mode: 'development',
  ...commonConfig,
  optimization: {
    ...commonConfig.optimization,
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
};

const productionConfig = {
  mode: 'production',
  ...commonConfig,
  optimization: {
    ...commonConfig.optimization,
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return {
      ...productionConfig,
      entry: {
        'admin/dashboard/index': './src/admin/Dashboard/index.tsx',
        'admin/reserved_seats/index': './src/admin/Product/ReservedSeats/index.tsx',
        'admin/discounts/index': './src/admin/Product/Discounts/index.tsx',
        'admin/custom_fields/index': './src/admin/Product/CustomFields/index.tsx',
        'admin/dates/index': './src/admin/Product/Dates/index.tsx',
        'admin/export_bookings/index': './src/admin/Product/ExportBookings/index.tsx',
        'admin/seat_planner/index': './src/admin/Product/SeatPlanner/index.tsx',
        'front/add_to_cart/add-to-cart': './src/front/AddToCart/index.tsx',
        'front/cart_timer/cart-timer': './src/front/CartTimer/index.js',
        /** 
         * Compatibility mode where lazy loading is not supported
         * so we need to load the component immediately
         * and disable lazy loading
         */
                'front-compat-mode/add_to_cart/add-to-cart': './src/front/AddToCart/index-compat.tsx',
      },
      output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].[contenthash].bundle.js',
        uniqueName: 'stachesepl',
        publicPath: 'auto'

      },
    };
  } else {
    return {
      ...developmentConfig,
      entry: {
        'admin/dashboard/index': './src/admin/Dashboard/index.tsx',
        'admin/reserved_seats/index': './src/admin/Product/ReservedSeats/index.tsx',
        'admin/discounts/index': './src/admin/Product/Discounts/index.tsx',
        'admin/custom_fields/index': './src/admin/Product/CustomFields/index.tsx',
        'admin/dates/index': './src/admin/Product/Dates/index.tsx',
        'admin/export_bookings/index': './src/admin/Product/ExportBookings/index.tsx',
        'admin/seat_planner/index': './src/admin/Product/SeatPlanner/index.tsx',
        'front/add_to_cart/add-to-cart': './src/front/AddToCart/index.tsx',
        'front/cart_timer/cart-timer': './src/front/CartTimer/index.js',
        /** 
         * Compatibility mode where lazy loading is not supported
         * so we need to load the component immediately
         * and disable lazy loading
         */
                'front-compat-mode/add_to_cart/add-to-cart': './src/front/AddToCart/index-compat.tsx',
      },
      output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        uniqueName: 'stachesepl',
        publicPath: 'auto'
      },
    };
  }
};