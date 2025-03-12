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
              '@babel/preset-react',
            ],
          },
        },
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
        'admin/discounts/index': './src/admin/Discounts/index.tsx',
        'admin/seat_scanner/index': './src/admin/SeatScanner/index.tsx',
        'admin/seat_planner/index': './src/admin/SeatPlanner/index.tsx',
        'front/add_to_cart/add-to-cart': './src/front/AddToCart/index.tsx',
      },
      output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
      },
    };
  } else {
    return {
      ...developmentConfig,
      entry: {
        'admin/discounts/index': './src/admin/Discounts/index.tsx',
        'admin/seat_scanner/index': './src/admin/SeatScanner/index.tsx',
        'admin/seat_planner/index': './src/admin/SeatPlanner/index.tsx',
        'front/add_to_cart/add-to-cart': './src/front/AddToCart/index.tsx',
      },
      output: {
        path: path.resolve(__dirname, 'assets'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
      },
    };
  }
};